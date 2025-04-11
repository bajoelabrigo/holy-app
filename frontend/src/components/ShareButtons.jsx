import React from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  InstapaperIcon,
  InstapaperShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  PinterestShareCount,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TumblrIcon,
  TumblrShareButton,
  TumblrShareCount,
  TwitterShareButton,
  VKIcon,
  VKShareButton,
  VKShareCount,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

export function ShareButton() {
  const shareUrl = window.location.href;
  const title = "HolyHolyHoly";

  const exampleImage = <img src="/avatar.png" />;

  return (
    <div className="Demo__container mt-2 flex space-x-1.5">
      <div className="Demo__some-network">
        <FacebookShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        {/* <div>
          <FacebookShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          >
            {(count) => count}
          </FacebookShareCount>
        </div> */}
      </div>

      <div className="Demo__some-network">
        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="Demo__some-network__share-button"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>

      <div className="Demo__some-network">
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>

      <div className="Demo__some-network">
        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>

      <div className="Demo__some-network">
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      <div className="Demo__some-network">
        <LinkedinShareButton
          url={shareUrl}
          className="Demo__some-network__share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>

      <div className="Demo__some-network">
        <PinterestShareButton
          url={String(window.location)}
          media={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <PinterestIcon size={32} round />
        </PinterestShareButton>

        {/* <div >
          <PinterestShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>

      <div className="Demo__some-network">
        <VKShareButton
          url={shareUrl}
          image={`${String(window.location)}/${exampleImage}`}
          className="Demo__some-network__share-button"
        >
          <VKIcon size={32} round />
        </VKShareButton>

        {/* <div>
          <VKShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>

      <div className="Demo__some-network">
        <RedditShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="Demo__some-network__share-button"
        >
          <RedditIcon size={32} round />
        </RedditShareButton>

        {/* <div>
          <RedditShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>

      <div className="Demo__some-network">
        <TumblrShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TumblrIcon size={32} round />
        </TumblrShareButton>

        {/* <div>
          <TumblrShareCount
            url={shareUrl}
            className="Demo__some-network__share-count"
          />
        </div> */}
      </div>

      <div className="Demo__some-network">
        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>

      <div className="Demo__some-network">
        <InstapaperShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <InstapaperIcon size={32} round />
        </InstapaperShareButton>
      </div>

      <div className="Demo__some-network">
        <ThreadsShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <ThreadsIcon size={32} round />
        </ThreadsShareButton>
      </div>
    </div>
  );
}

export default ShareButton;
