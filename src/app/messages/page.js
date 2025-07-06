import { Suspense } from "react";
import MessageComponent from "./MessageComponent";

export default function MessagesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessageComponent />
    </Suspense>
  );
}
