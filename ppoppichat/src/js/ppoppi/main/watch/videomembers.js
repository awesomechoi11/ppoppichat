import { useDocument } from 'react-firebase-hooks/firestore';
import placeholderPicture from '../../../../assets/ppoppi.png'
import { fire } from '../../../utils/firebasecontext'


export function VideoMembers(props) {
    const [value] = useDocument(
        fire.firestore().doc('/videorooms/' + props.videoroomID + '/videoState/members')
    );
    if (value) {
        if (value.exists) {
            return (
                <div className='members-list-inner'>
                    {value.data().members.map((member, index) => (
                        <MemberItem key={index} userRef={member}></MemberItem>
                    ))}
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


function MemberItem(props) {
    //firebase.firestore()
    const [userData, loading] = useDocument(
        //firebase.firestore().doc('videorooms/' + videoRoom),
        props.userRef,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    //console.log(loading, userData)

    //var imgsrc = placeholderPicture
    //var username = 'Loading...'
    if (loading) {
        return (
            <div className='member-item-wrapper'>
                <img className='member-item-picture' alt='user profile' src={placeholderPicture}></img>
                <div className='member-item-name'>
                    Loading...
                </div>
            </div>
        )
    }
    return (
        <div className='member-item-wrapper'>
            <img className='member-item-picture' alt='user profile' src={userData.data().photoURL}></img>
            <div className='member-item-name'>
                {userData.data().username}
            </div>
        </div>
    )

}