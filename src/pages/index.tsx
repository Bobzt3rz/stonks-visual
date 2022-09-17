import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { trpc } from "../utils/trpc";

const Home = () => {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [cik, setCik] = useState("");
  const ctx = trpc.useContext();
  const postMessage = trpc.useMutation("guestbookpostMessage", {
    onMutate: () => {
      ctx.cancelQuery(["guestbookgetAll"]);
      const optimisticUpdate = ctx.getQueryData(["guestbookgetAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["guestbookgetAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["guestbookgetAll"]);
    },
  });
  // useQuery(["cik"], async () => {
  //   const response = await fetch("https://www.sec.gov/include/ticker.txt", {
  //     headers: {
  //       "User-Agent":
  //         "bunnavit bunnavit@airtechnology.io",
  //       "Accept-Encoding": "gzip, deflate",
  //       Host: "www.sec.gov",
  //     },
  //   });
  //   if (!response.ok) throw new Error("Something went wrong");
  //   console.log(response);
  // });
  useEffect(() => {
    const sendRequest = async () => {
      const myHeaders = new Headers();
      myHeaders.append(
        "Cookie",
        "ak_bmsc=1944099A8025459D2B426F9AF690EB79~000000000000000000000000000000~YAAQi/zaF/1Q3AiDAQAA//+FShFIqIsYB65+fxiR8y9XDACDCcpL2YuWADt86H8jq+ZRmo2A5nm8iswayqGYg7Z0D5HCaQLRCbfVba+fldDQzzUL7vMtBG4Rsb28b6Rraw/2L/flUV3SsPe4lhTmGaH8pZz4uEo3MXaCEjf2vflhoxZfI7H54vBKv1ElLWOitMyCoBfs9cKbcEEcfppfUiQbDSh8YhuJmyBsMWtJlSaxrdUn51o57rSYJeuA9dSLWZw8E3AFUuxyr+tLwZCY+YcjbuNmMAIjsbemRRUjKpMvi0nI3dFJVeXN6pATkxQHhu50bfq9oNfp22C+FZ4twpo9+qsAzGckhgozhMAIGouFL89+pNlzmg=="
      );
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      fetch("https://www.sec.gov/include/ticker.txt", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    };
    sendRequest();
  }, []);

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Guestbook</h1>
      <p>
        Tutorial for <code>create-t3-app</code>
      </p>

      <div className="pt-10">
        {session ? (
          <div>
            <p>hi {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
            <div className="pt-6">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  postMessage.mutate({
                    name: session.user?.name as string,
                    message,
                  });
                  setMessage("");
                }}
              >
                <input
                  type="text"
                  value={message}
                  placeholder="Your message..."
                  maxLength={100}
                  onChange={(event) => setMessage(event.target.value)}
                  className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="pt-10">
              <Messages />
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login with discord
            </button>
            <div className="pt-10">
              <Messages />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const Messages = () => {
  const { data: messages, isLoading } = trpc.useQuery(["guestbookgetAll"]);
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        return (
          <div key={index}>
            <p>{msg.message}</p>
            <span>{msg.name}</span>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
