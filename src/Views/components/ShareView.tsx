import React from 'react';
import {
    EmailShareButton,
    FacebookShareButton,
    PinterestShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
} from "react-share";

import {
    FacebookIcon, 
    TwitterIcon, 
    PinterestIcon, 
    TelegramIcon, 
    WhatsappIcon,    
    EmailIcon, 
    RedditIcon,
    LinkedinIcon,
} from "react-share" ;

import "./css/ShareView.css";

interface ShareViewProps {

    address : string, 

    quote : string, 

    hashtag : string, 

}


export const ShareView   : React.FC<ShareViewProps> = ({address, quote, hashtag}) =>{

    const shareUrl = window.location.protocol + "//" + window.location.host  + "/" + address;

    return <div style={{textAlign:"center"}}>

        <FacebookShareButton  url={shareUrl}  
        quote={quote} hashtag={hashtag} className="shareIcon">
             <FacebookIcon size={46} />
        </FacebookShareButton>

        <TwitterShareButton  url={shareUrl} className="shareIcon">
             <TwitterIcon size={46} />
        </TwitterShareButton>
    
        <WhatsappShareButton  url={shareUrl} className="shareIcon">
             <WhatsappIcon size={46} />
        </WhatsappShareButton>

        <TelegramShareButton  url={shareUrl} className="shareIcon">
             <TelegramIcon size={46} />
        </TelegramShareButton>
        <br/>
        <PinterestShareButton  url={shareUrl} media="" description={quote} className="shareIcon">
             <PinterestIcon size={46} />
        </PinterestShareButton>

        <RedditShareButton  url={shareUrl}  className="shareIcon">
             <RedditIcon size={46} />
        </RedditShareButton>

        <LinkedinShareButton  url={shareUrl}  className="shareIcon">
             <LinkedinIcon size={46} />
        </LinkedinShareButton>

        <EmailShareButton  url={shareUrl}  className="shareIcon">
             <EmailIcon size={46} />
        </EmailShareButton>

    </div>

}
