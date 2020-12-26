import { leaveVideoroom } from "../firebaseFunctions"


export function Placeholder(props) {
    console.log(props[0].userRef)
    leaveVideoroom(props[0].userRef)

    return (
        <div>
            hello
        </div>
    )
}