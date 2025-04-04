import { BellOff, ChevronRight, X } from "lucide-react";

function Notifications() {
  return (
    <div className="h-[120px] mt-4 bg-base-200 flex items-center p-[13px]">
      {/*container*/}
      <div className="w-full flex items-center justify-between">
        {/*left*/}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer bg-sky-500 rounded-full h-14 w-14 flex items-center justify-center">
            <BellOff  size={32}/>
          </div>
          <div className="flex flex-col">
            <span className="text-xl">Get notified of new messages</span>
            <span className="text-[16px] font-extralight text-success mt-0.5 flex items-center gap-0.5">
              Turn on desktop notifications
              <ChevronRight />
            </span>
          </div>
        </div>

        {/*rigth*/}
        <div className="cursor-pointer">
          <X className="" size={32} />
        </div>
      </div>
    </div>
  );
}

export default Notifications;
