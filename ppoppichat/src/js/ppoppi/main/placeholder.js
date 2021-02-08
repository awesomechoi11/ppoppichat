import { leaveVideoroom } from "../../utils/firebaseFunctions"
import { UserContext } from '../../utils/firebasecontext'


export function Placeholder(props) {
    console.log(props[0].key)
    //leaveVideoroom(props[0].userData)

    return (
        <div>
            <UserContext.Consumer>
                {value => leaveVideoroom(value.userRef)}
            </UserContext.Consumer>
            hello
        </div>
    )
}