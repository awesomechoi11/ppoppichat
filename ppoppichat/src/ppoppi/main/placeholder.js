import { leaveVideoroom } from "../firebaseFunctions"
import { UserContext } from '../../firebasecontext'


export function Placeholder(props) {
    console.log(props[0].key)
    //leaveVideoroom(props[0].userData)

    return (
        <div>
            hello
        </div>
    )
}