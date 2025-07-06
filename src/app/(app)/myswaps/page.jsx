"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoAddCircleSharp } from "react-icons/io5";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserFromStorage(parsedUser.userName || "");
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    } else {
      setLoading(false);
      setErrorMessage("User not logged in");
    }
  }, []);

  useEffect(() => {
    if (!currentUserFromStorage) return;

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://backend-skillswap.vercel.app/get-swap-tasks",
          {
            params: { currentUser: currentUserFromStorage },
          }
        );

        if (response.data.success) {
          console.log("Fetched tasks:", response.data.tasks);
          setTasks(response.data.tasks);
        } else {
          setErrorMessage("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setErrorMessage("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUserFromStorage]);

  // ✅ FRONTEND FIXED
  const handleConfirm = async (taskId) => {
    try {
      const response = await axios.post(
        "https://backend-skillswap.vercel.app/confirm-task",
        {
          taskId,
          currentUser: currentUserFromStorage,
        }
      );

      if (response.data.success) {
        alert("Task confirmed!");

        const refreshResponse = await axios.get(
          "https://backend-skillswap.vercel.app/get-swap-tasks",
          { params: { currentUser: currentUserFromStorage } }
        );

        if (refreshResponse.data.success) {
          const updatedTasks = refreshResponse.data.tasks;
          setTasks(updatedTasks);

          const matchedSwapTasks = updatedTasks.filter(
            (t) => t.taskId === taskId
          );

          const usersInSwap = [
            ...new Set(matchedSwapTasks.map((t) => t.currentUser)),
          ];

          const bothConfirmed =
            matchedSwapTasks.length === 2 &&
            matchedSwapTasks.every((task) => task.isConfirmed === true); // ✅ FIX

          if (bothConfirmed && usersInSwap.length === 2) {
            console.log(
              "Both confirmed, incrementing swap count:",
              usersInSwap
            );

            await axios.post(
              "https://backend-skillswap.vercel.app/api/increment-swap-count",
              {
                users: usersInSwap,
                taskId,
              }
            );
          }
        } else {
          setErrorMessage("Failed to refresh tasks after confirmation.");
        }
      }
    } catch (error) {
      console.error("Error confirming task:", error);
      setErrorMessage("Error confirming task.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.post(
        "https://backend-skillswap.vercel.app/delete-task",
        {
          taskId,
        }
      );

      if (response.data.success) {
        alert("Task deleted!");
        setTasks((prev) => prev.filter((task) => task.taskId !== taskId));
      } else {
        setErrorMessage("Error deleting task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Error deleting task.");
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <>
      <div className="p-6 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Your Task Swaps</h2>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks available.</p>
        ) : (
          <div className="space-y-4">
            {(() => {
              const taskMap = {};
              tasks.forEach((task) => {
                if (!taskMap[task.taskId]) {
                  taskMap[task.taskId] = {};
                }

                if (task.currentUser === currentUserFromStorage) {
                  taskMap[task.taskId].myTask = task;
                } else {
                  taskMap[task.taskId].theirTask = task;
                }

                taskMap[task.taskId].status = task.status;
              });

              return Object.entries(taskMap).map(([taskId, pair]) => (
                <div
                  key={taskId}
                  className="flex flex-col sm:grid sm:grid-cols-5 md:grid-cols-6 gap-4 bg-white shadow rounded-xl p-4 border border-gray-200 text-sm"
                >
                  <div className="text-gray-400">#{taskId}</div>

                  <div>
                    <p className="font-semibold text-blue-600">
                      {pair.myTask ? pair.myTask.taskName : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">You will do</p>
                    <p className="text-xs text-gray-600">
                      Time:{" "}
                      {pair.myTask ? `${pair.myTask.timeRequired} hrs` : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-green-600">
                      {pair.theirTask ? pair.theirTask.taskName : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pair.theirTask
                        ? `${pair.theirTask.currentUser} will do`
                        : "They will do"}
                    </p>
                    <p className="text-xs text-gray-600">
                      Time:{" "}
                      {pair.theirTask
                        ? `${pair.theirTask.timeRequired} hrs`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">
                      {pair.myTask
                        ? new Date(pair.myTask.deadline).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Deadline</p>
                  </div>

                  <div
                    className={`${
                      pair.myTask?.isConfirmed && pair.theirTask?.isConfirmed
                        ? "text-green-600"
                        : "text-yellow-600"
                    } font-medium`}
                  >
                    {pair.myTask?.isConfirmed && pair.theirTask?.isConfirmed
                      ? "Confirmed by both"
                      : pair.myTask?.isConfirmed
                      ? "You confirmed"
                      : pair.theirTask?.isConfirmed
                      ? `${pair.theirTask.currentUser} confirmed`
                      : "Pending"}
                  </div>

                  <div className="flex gap-2 sm:justify-end">
                    {!(
                      pair.myTask?.isConfirmed && pair.theirTask?.isConfirmed
                    ) && (
                      <>
                        {!pair.myTask?.isConfirmed && (
                          <button
                            onClick={() => handleConfirm(taskId)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(taskId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* Floating Add Task Button */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => (window.location.href = "/services")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center text-4xl"
          title="Add New Task"
        >
          <IoAddCircleSharp />
        </button>
      </div>
    </>
  );
}
