import { BellOff, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocketContext } from "../../../../context/SocketContext";

function Notifications() {
  const [newMessage, setNewMessage] = useState(null);
  const [visible, setVisible] = useState(true);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    // Escuchar nuevo mensaje
    socket.on("newMessage", (data) => {
      setNewMessage(data);
      showBrowserNotification(data);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  const showBrowserNotification = (data) => {
    if (Notification.permission === "granted") {
      new Notification("Nuevo mensaje", {
        body: `${data?.senderId?.name || "Nuevo mensaje"}: ${data?.message}`,
        icon: "/logo192.png",
      });
    }
  };

  const handleRequestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      alert("Notificaciones del navegador activadas");
    }
  };

  if (!visible) return null;

  return (
    <div className="h-[120px] mt-4 bg-base-200 flex items-center p-[13px]">
      <div className="w-full flex items-center justify-between">
        {/* Izquierda */}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer bg-sky-500 rounded-full h-14 w-14 flex items-center justify-center">
            <BellOff size={32} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl">
              {newMessage
                ? `Nuevo mensaje de ${newMessage?.senderId?.name}`
                : "Get notified of new messages"}
            </span>
            <span
              onClick={handleRequestPermission}
              className="text-[16px] font-extralight text-success mt-0.5 flex items-center gap-0.5 cursor-pointer"
            >
              Turn on desktop notifications
              <ChevronRight />
            </span>
          </div>
        </div>

        {/* Derecha */}
        <div className="cursor-pointer" onClick={() => setVisible(false)}>
          <X size={32} />
        </div>
      </div>
    </div>
  );
}

export default Notifications;
