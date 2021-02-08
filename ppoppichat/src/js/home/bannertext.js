import '../../sass/home/bannertext.scss'


export default function BannerText(props) {

    return (
        <div className='banner'>
            {props.children}
        </div>
    )

}