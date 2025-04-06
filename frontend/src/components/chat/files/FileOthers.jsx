export default function FileOthers({ file, type, me }) {
  const types = file?.public_id?.split(".")[1];
  return (
    <div className="rounded-lg text-white">
      {/*Container*/}
      <div className="flex justify-between gap-x-8">
        {/*File infos*/}
        <div className="flex items-center gap-2">
          <img
            src={`../../../../public/images/file/${types}.png`}
            alt=""
            className="w-8 object-contain"
          />
          <div className="flex flex-col gap-2">
            <h1>
              {file?.original_filename}.{file?.public_id?.split(".")[1]}
            </h1>
            <span className="text-sm">
              {types?.toUpperCase()} . {file?.bytes}B
            </span>
          </div>
        </div>
        {/*Download button*/}
        <div className="w-8"></div>
        {/* {!me && (
          <a href={file.secure_url} target="_blank" download>
            <DownloadIcon className="dark:text-dark_text_1"/>
          </a>
        )} */}
      </div>
    </div>
  );
}
