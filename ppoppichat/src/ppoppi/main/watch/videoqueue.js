import { useDocument } from 'react-firebase-hooks/firestore';
//import placeholderPicture from './unknown.png'
import { fire } from '../../../firebasecontext'

const pawpaws = (
    <svg className='pawpaws' width="96" height="84" viewBox="0 0 96 84" fill="none" >
        <ellipse cx="12.3236" cy="25.1614" rx="12.2059" ry="12.2581" />
        <ellipse cx="47.2059" cy="12.2581" rx="12.2059" ry="12.2581" />
        <ellipse cx="83.2059" cy="25.2581" rx="12.2059" ry="12.2581" />
        <path d="M46.5 32.5161C7.7581 32.5161 -29.9711 84 46.5001 84C122.971 84 85.2418 32.5161 46.5 32.5161Z" />
    </svg>

)


export function VideoQueue(props) {
    const [value] = useDocument(
        fire.firestore().doc('/videorooms/' + props.videoroomID + '/videoState/queue')
    );
    if (value) {
        if (value.exists) {
            console.log(value.data().queue.length)
            return (
                <div className='members-list-inner'>
                    {value.data().queue.length > 0 ?
                        value.data().queue.map((video, index) => (
                            <QueueItem key={index} videoData={video} />
                        ))
                        :
                        <div className='empty-queue-placeholder'
                            onClick={e => {

                            }}
                        >
                            {pawpaws}
                            <div>
                                click to add a video!
                            </div>
                        </div>

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