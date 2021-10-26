import React from 'react';
import './css/AboutPage.css';

export const AboutPage : React.FC = () => {

        return <div>
            <div className="aboutDiv">

                <p>Solfund - A Mutual Fund system that works on the Solana Blockchain.
                <ul style={{padding:"20px"}}>
                <li>Anyone connected with a SOL wallet can become fund manager and create your own
                fund pools and get your investors to invest in them.</li>

                <li>Anyone connected with a SOL wallet can invest in any fund pools available
                    in the market or fund pools shared by fund managers.</li>

                </ul>

                </p>

                <p>Designed &amp; Developed By Christopher K Y Chee (ketyung@techchee.com 
                    &nbsp;<a target="_blank" href="https://github.com/ketyung/" rel="noreferrer">https://github.com/ketyung/</a>) for 
                Solana Ignition Hackathon</p> 

                <p><a target="_blank" href="https://twitter.com/techchee" rel="noreferrer">Twitter</a></p> 
                
                <p>Initial Idea Credit To Marcus Yong</p>
            </div>
            
        </div>

}