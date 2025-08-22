import axios from "axios";
import toast from "react-hot-toast";

export const handleInvalidToken = async ({
  error,
  router,
}: {
  error: any;
  router: any;
}) => {
  const responseData = JSON.parse(error.request.response);
  if (responseData.error === "invalid token") {
    try {
      await axios.get("/api/auth/logout");
      router.push("/login");
    } catch (error: any) {
      toast.custom((t) => (
        <div
          className={`bg-error/20 rounded-2xl px-6 py-4 font-semibold shadow-lg ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          {error.message}
        </div>
      ));
    }
  }
};
