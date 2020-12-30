import { useDocument } from 'react-firebase-hooks/firestore';
//import placeholderPicture from './unknown.png'
import { fire } from '../../../firebasecontext'


export function VideoQueue(props) {
    const [value] = useDocument(
        fire.firestore().doc('/videorooms/' + props.videoroomID + '/videoState/queue')
    );
    if (value) {
        if (value.exists) {
            console.log(value.data())
            return (
                <div className='members-list-inner'>
                    {
                        value.data().queue.map((video, index) => (
                            <QueueItem key={index} videoData={video} />
                        ))
                    }
                </div>
            )
        } else {
            return (
                <div className='members-list-inner'>
                    doc doesnt exist
                </div>
            )
        }
    } else {
        return (
            <div className='members-list-inner'>
                loading
            </div>
        )
    }


}


function QueueItem(props) {
    //get youtube video information
    //assumes all info is correct
    //console.log(props.videoData)

    return (
        <div className='queue-item-wrapper'>
            <img className='queue-item-picture'
                alt='owo'
                src={props.videoData.videoInfo.thumbnail}
            />
            <div className='queue-item-data'>
                <div className='queue-data-title'>
                    {props.videoData.videoInfo.title}
                </div>
                <div className='queue-data-under'>
                    <div className='queue-data-user'>
                        added by {props.videoData.addedBy}
                    </div>
                    <div className='queue-data-length'>
                        3:21
            </div>
                </div>
            </div>
        </div>
    )
}