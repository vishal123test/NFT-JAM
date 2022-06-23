import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  border: 4px solid;
  border-color: #00d1f6;
  background-color: var(--secondary);
  padding: 0px;
  font-weight: bold;
  color: var(--secondary-text-btn);
  width: 100px;
  cursor: pointer;
  font-family: impact;
  font-size: 30px;
  fill: #f5c314;
  opacity: 1;
  margin: 14px 0 0 55px;
  text-shadow: -5px 4px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButtons= styled.button`
  border: 4px solid;
  border-color: #00d1f6;
  background-color: var(--secondary);
  padding: 0px;
  font-weight: bold;
  color: var(--secondary-text-btn);
  width: 100px;
  cursor: pointer;
  font-family: impact;
  font-size: 30px;
  fill: #f5c314;
  opacity: 1;
  margin: 14px;
  text-shadow: -5px 4px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px; 
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 15px;
  font-weight: bold;
  font-size: 24px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: -4px 3px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLogob = styled.img`
  @media (min-width: 767px) {
  }
  transition: width 0.5s;
  transition: height 0.5s;
  width: 143px;
    height: 10px;
    margin-top: 0px;
    border: 1px solid rgb(99, 133, 150);
    box-shadow: 3px -10px inset #000;
`;

export const StyledLogoa = styled.img`
  @media (min-width: 767px) {
  }
  transition: width 0.5s;
  transition: height 0.5s;
  width: 143px;
    height: 10px;
    margin-top: 0px;
    border: 1px solid rgb(99, 133, 150);
    box-shadow: 3px -10px inset #000;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState();
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg3.jpg" : null}
      >
      
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
           
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={0.5}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              height: "100%",
              border: "10px solid #048392",
              boxShadow: "inset 0px 0px 0px 10px #226a7d"
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                fontFamily: "impact",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
                       
            <span
              style={{
                textAlign: "center",
              }}
            >
             
            </span>
            <s.SpacerSmall />
              
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    CONNECTED
                  </s.TextDescription>

                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)", fontSize: "18px", fontFamily: "impact" }}
                >
                  .01 eth
                </s.TextDescription>
                  <s.SpacerSmall />
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    
                    <s.SpacerSmall />
                    
                    <StyledLogob alt={"redbar"} src={"/config/images/Bar.png"} />
                    
                    <StyledButtons
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      MINT
                    </StyledButtons>

                  <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--primary-text)",
                          marginTop: "20px",
                          marginRight: "-54px",
                          marginLeft: "-50px",
                          border: "1px solid",
                          borderColor: "#638596",
                        }}
                      >
                         Private Note:
                         To access the Private Note feature, You must be Connected Metamask
                      </s.TextDescription>
                      <s.SpacerSmall />                      
                    </s.Container>
                  <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                  </s.TextDescription>
                                    
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                      
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>

                    <StyledLogoa alt={"redbar"} src={"/config/images/Bar.png"} />

                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text-num)",
                          textShadow: "-3px 3px #000",
                          fontSize: "28px",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          opacity: "1",                 
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    { <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                      {claimingNft ? "MINT" : "MINT"}
                      </StyledButton>

                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "#dad748",
                          fontFamily: "var(--accent-font-family)",
                          marginTop: "-730px",
                          marginLeft: "-80px",
                          opacity: "1"                               
                        }}
                      >
                      CONNECTED
                    </s.TextDescription>
                    <StyledLogo style={{
                    marginTop: "-705px",
                    width: "200px",
                    marginLeft: "-130px",
                    height: "10px"
                    }} 
                    alt={"redbar"} src={"/config/images/redbar.png"} />
                      
                    </s.Container> }
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
         
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              padding: "20px 60px",
              background: "#0a023f",
              position: "absolute",
              width: "100%"
            }}
          >
            
           2022 - NOT AFFLIATED WITH NBA JAM OR ANY OTHER NFT PROJECT
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
