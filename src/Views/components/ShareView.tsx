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

import { Button } from 'antd';
import "./css/ShareView.css";

interface ShareViewProps {

    address : string, 

    quote : string, 

    hashtag : string, 

}


export const ShareView   : React.FC<ShareViewProps> = ({address, quote, hashtag}) =>{

    const shareUrl = window.location.protocol + "//" + window.location.host  + "/" + address;

    const [copied, setCopied] = React.useState(false);

    function copyURL() {
          const el = document.createElement("input");
          el.value = shareUrl;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
          setCopied(true);

          setTimeout(()=>{
               setCopied(false);
          }, 5000);

     }

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

        <br/>

        <Button style={{margin: "10px 10px 10px 20px", padding:"4px", minWidth:"150px",borderRadius:"20px"}}
          onClick={async ()=> {
               
               copyURL();
               
          }}>{copied ? "Copied" : "Copy URL"}</Button>


    </div>

}
