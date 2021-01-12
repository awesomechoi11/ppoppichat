const functions = require('firebase-functions');
const axios = require('axios');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const youtubeKey = 'AIzaSyD4gofW55ThI48ZyaGTa9KcmXHXdCf3Qjc'
const vimeoKey = '2417858829570c04c1358511aac6eb3c'
const unauthdVimeoKey = '126864d9f48da089b0af0f87444b43ee'

const usersCol = admin.firestore().collection('users')
const db = admin.firestore()




function fetchYoutubeVid(id) {
	//console.log(id)

	return axios.get('https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&key=' + youtubeKey + '&query=&id=' + id)
		.then((response) => {
			// handle success
			var owo = response.data.items[0].snippet
			return {
				title: owo.title,
				thumbnail: owo.thumbnails.default.url,
				time: response.data.items[0].contentDetails.duration
			}
		})
		.catch((error) => {
			// handle error
			functions.logger.error("error getting youtube video", { structuredData: true });
			console.log(error.response.data);
			return false
		})

}

function fetchVimeoVid(id) {
	var config = {
		method: 'get',
		url: 'https://api.vimeo.com/videos/' + id,
		headers: {
			'Authorization': 'Bearer ' + vimeoKey
		}
	};
	return axios(config)
		.then(function (response) {
			return {
				title: response.data.name,
				thumbnail: response.data.pictures.sizes[0].link,
				time: response.data.duration
			}
		})
		.catch(function (error) {
			functions.logger.error("error getting vimeo video", { structuredData: true });
			console.log(error.response.data);
			return false
		});


}
//youtube. vimeo. mp4
//youtube.com, youtu.be
const ytobj = [
	'youtube.com',
	'www.youtube.com',

]
const ytshort = [
	'youtu.be',
	'www.youtu.be'

]
const vimeoobj = [
	'vimeo.com',
	'www.vimeo.com'
]
const acceptedFormats = [
	'mp4', 'm4a', 'm4p', 'm4b', 'm4r', 'm4v',
	'webm'
]


function getVideoInfo(link) {

	var myURL
	try {
		myURL = new URL(link);
	} catch (err) {
		console.log(err)
		return new Promise((resolve, reject) => {
			resolve(false)
		})
	}

	var data = {
		type: 'youtube',
		url: link,
		videoInfo: '123',
	}
	var vidid
	if (ytobj.includes(myURL.hostname)) {
		vidid = myURL.searchParams.get('v')
		return fetchYoutubeVid(vidid)
			.then(youtubedata => {
				if (youtubedata) {
					data.id = vidid
					data.videoInfo = youtubedata
					return data
				}
				return false
			})

	} else if (ytshort.includes(myURL.hostname)) {
		vidid = myURL.pathname.split('/').pop()
		return fetchYoutubeVid(vidid)
			.then(youtubedata => {
				if (youtubedata) {
					data.id = vidid
					data.videoInfo = youtubedata
					return data
				}
				return false
			})

	} else if (vimeoobj.includes(myURL.hostname)) {
		data.id = myURL.pathname.split('/').pop()
		data.type = 'vimeo'
		return fetchVimeoVid(data.id)
			.then(vimeodata => {
				data.videoInfo = vimeodata
				return data
			})

	} else if (acceptedFormats.includes(myURL.pathname.split('.').pop())) {
		return new Promise((resolve, reject) => {
			data.type = 'html5'
			resolve(data)
		})
	} else {
		functions.logger.info("not a valid media link: " + link, { structuredData: true });
		return new Promise((resolve, reject) => {
			resolve(false)
		})
	}

}



exports.addVideoToList = functions.https.onRequest((request, response) => {
	//cors(request, response, () => {
	// your function body here - use the provided req and res from cors
	response.set('Access-Control-Allow-Origin', '*');
	functions.logger.info("addVideoToList", { structuredData: true });

	const queryurl = request.query.url;
	const username = request.query.username
	const videoroomID = request.query.videoroom
	if (username && queryurl && videoroomID) {
		const videodata = getVideoInfo(request.query.url);
		if (videodata) {

			videodata.then(result => {
				if (result.videoInfo) {
					result.addedBy = username
					//console.log(result)
					return addToQueue(videoroomID, result)
						.then(() => {

							response.send("success");
							console.log('successfully added video to queue')
							return
						}).catch(err => {
							console.log(err)
							response.send("uh oh video room may not exist");
						})
					//sent result to database

				} else {
					response.send("err occured!! check logs");
					return
				}
			}).catch(err => {
				console.log(err)
				response.send("uh oh !! err occured!! check logs");
			})
		} else {
			response.send('invalid url')
		}
	} else {
		response.send('invalid query')
	}

});


function addToQueue(videoroomID, videoData) {
	const docRef = admin.firestore().doc('/videorooms/' + videoroomID + '/videoState/queue')
	//console.log(docRef)
	return docRef.update({
		queue: admin.firestore.FieldValue.arrayUnion(videoData)
	})
}


exports.removeUserFromVideoroom = functions.https.onRequest((request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	const userID = request.query.userID;
	if (userID) {
		leaveVideoroom(userID)
		response.send('removing user')
	} else {
		response.send('missing userID')
	}

	//response.send("uh oh howd u get here?");
});


function leaveVideoroom(userID) {
	//get currentRoom
	var userRef = usersCol.doc(userID)
	userRef.get()
		.then(userdata => {
			const videoroomID = userdata.get('currentVideoroom')
			if (videoroomID === 'none') {
				console.log('user is not in a room!')
				return
			}
			return db.collection('videorooms').doc(videoroomID).update({
				members: firebase.firestore.FieldValue.arrayRemove(userRef)
			}).then(() => {
				return userRef.update({
					currentVideoroom: 'none'
				})
			}).then(() => {
				console.log('user successfully left room')
				return
			}).catch(err => {
				console.log('err leaving videoroom: ', err)
			})
		}).catch(err => {
			console.log('err getting userdata: ', err)
		})
}


