import { WalletButton } from "components/Common/Buttons";
import { TwitterImg } from "components/Common/Images";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Provider,
  RootStateOrAny,
  useDispatch,
  useSelector,
} from "react-redux";
import Image from "next/image";
import { linkAccounts, unlinkAccounts } from "redux/slices/profileSlice";

const twitterLinkGenerator = (currentUrl: string) => {
  const baseUrl = "https://twitter.com/i/oauth2/authorize";
  const params = {
    response_type: "code",
    client_id: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
    redirect_uri: currentUrl,
    scope: "tweet.read users.read offline.access",
    state: "state",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  };
  const urlParams = new URLSearchParams(params);
  return baseUrl + "?" + urlParams.toString();
};

export const TwitterLink = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { twitterConnected, twitterUsername } = useSelector(
    (state: RootStateOrAny) => state.profile.data
  );
  const {
    query: { link, code },
    asPath,
  } = router;
  const [appUrl, setAppUrl] = useState("");

  useEffect(() => {
    let url = new URL(window.location.origin + asPath);
    let params = new URLSearchParams(url.search);
    params.delete("state");
    params.delete("code");
    params.set("link", "twitter");
    let appUrl = url.origin + url.pathname + "?" + params.toString();
    setAppUrl(appUrl);
  }, []);

  useEffect(() => {
    if (link === "twitter") {
      dispatch(
        linkAccounts({
          data: {
            link: "twitter",
            code,
            url: appUrl,
          },
          finalFunction: () => {},
        })
      );
    }
  }, [code, link]);

  return (
    <>
      {twitterConnected ? (
        <button
          className={`font-medium py-[22px] px-[22px] rounded-[14px] text-white/70 h-[56px] text-[18px] sm:text-[22px] text-center tracking-wider border-none outline outline-primary hover:bg-focusbackground hover:outline-1 hover:outline-primary inline-flex items-center bg-[#1d1e20] justify-between !w-[100%] outline-1 bg-focusbackground !text-white`}
          onClick={() => {
            dispatch(
              unlinkAccounts({
                data: {
                  link: "twitter",
                  code,
                },
                finalFunction: () => {},
              })
            );
          }}
        >
          <span className="text-[16px] w-[90%] text-left">{"Disconnect"}</span>
          <div className="pt-2 text-right">
            <Image src={TwitterImg} width={28} height={28} />
          </div>
        </button>
      ) : (
        <a
          className={`font-medium py-[22px] px-[22px] rounded-[14px] text-white/70 h-[56px] text-[18px] sm:text-[22px] text-center tracking-wider border-none outline outline-primary hover:bg-focusbackground hover:outline-1 hover:outline-primary inline-flex items-center bg-[#1d1e20] justify-between !w-[100%]`}
          href={twitterLinkGenerator(appUrl)}
          target="_blank"
        >
          <span className="text-[16px] w-[90%] text-left">{"Connect"}</span>
          <div className="pt-2 text-right">
            <Image src={TwitterImg} width={28} height={28} />
          </div>
        </a>
      )}
    </>
  );
};
