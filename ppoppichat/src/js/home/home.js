import '../../sass/home/home.scss'

import BannerText from './bannertext'

export function Home() {

    return (
        <div className='home'>

            <div className='banner-wrapper'>

                <BannerText>
                    <span className='banner-text-left'>
                        watch
                    </span>
                    <span className='banner-text-right'>
                        &
                    </span>
                </BannerText>
                <BannerText>
                    <span className='banner-text-left'>
                        chat
                    </span>
                    <span className='banner-text-right'>
                        w/
                    </span>
                </BannerText>
                <BannerText>
                    <span className='banner-text-left'>
                        friends
                    </span>
                    <span className='banner-text-right'>
                        :)
                    </span>
                </BannerText>
            </div>
        </div>
    )

}