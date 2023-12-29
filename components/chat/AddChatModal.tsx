import { Dialog, Switch, Transition } from "@headlessui/react";
import {
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { createGroupChat, createUserChat, getAvailableUsers } from "../../apihandler/chat.api";
import { ChatListItemInterface } from "../../interfaces/chat.interface";
import { UserInterface } from "../../interfaces/user.interface";
import { requestHandler } from "../../utils/requestHandler.utils";
import {Button} from "../button";
import Input from "../input";
import Select from "../select";
import { classes } from "./chat.style";
import { useOpenChat } from "@/context/AddChatContext";

const AddChatModal: React.FC<{
  onSuccess: (chat: ChatListItemInterface) => void;
}> = ({ onSuccess }) => {
  const { setOpenAddChat, openAddChat} = useOpenChat()

  // State to store the list of users, initialized as an empty array
  const [users, setUsers] = useState<UserInterface[]>([]);
  // State to store the name of a group, initialized as an empty string
  const [groupName, setGroupName] = useState("");
  // State to determine if the chat is a group chat, initialized as false
  const [isGroupChat, setIsGroupChat] = useState(false);
  // State to store the list of participants in a group chat, initialized as an empty array
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  // State to store the ID of a selected user, initialized as null
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  // State to determine if a chat is currently being created, initialized as false
  const [creatingChat, setCreatingChat] = useState(false);

  // Function to fetch users
  const getUsers = async () => {
    // Handle the request to get available users
    requestHandler(
      // Callback to fetch available users
      async () => await getAvailableUsers(),
      null, // No loading setter callback provided
      // Success callback
      (res) => {
        const { data } = res; // Extract data from response
        setUsers(data || []); // Set users data or an empty array if data is absent
      },
      alert // Use the alert as the error handler
    );
  };

  // Function to create a new chat with a user
  const createNewChat = async () => {
    // If no user is selected, show an alert
    if (!selectedUserId) return alert("Please select a user");

    // Handle the request to create a chat
    await requestHandler(
      // Callback to create a user chat
      async () => await createUserChat(selectedUserId),
      setCreatingChat, // Callback to handle loading state
      // Success callback
      (res) => {
        const { data } = res; // Extract data from response
        // If chat already exists with the selected user
        if (res.statusCode === 200) {
          alert("Chat with selected user already exists");
          return;
        }
        onSuccess(data); // Execute the onSuccess function with received data
        handleClose(); // Close the modal or popup
      },
      alert // Use the alert as the error handler
    );
  };

  // Function to create a new group chat
  const createNewGroupChat = async () => {
    // Check if a group name is provided
    if (!groupName) return alert("Group name is required");
    // Ensure there are at least 2 group participants
    if (!groupParticipants.length || groupParticipants.length < 2)
      return alert("There must be at least 2 group participants");

    // Handle the request to create a group chat
    await requestHandler(
      // Callback to create a group chat with name and participants
      async () =>
        await createGroupChat({
          name: groupName,
          participants: groupParticipants,
        }),
      setCreatingChat, // Callback to handle loading state
      // Success callback
      (res) => {
        const { data } = res; // Extract data from response
        onSuccess(data); // Execute the onSuccess function with received data
        handleClose(); // Close the modal or popup
      },
      alert // Use the alert as the error handler
    );
  };

  // Function to reset local state values and close the modal/dialog
  const handleClose = () => {
    // Clear the list of users
    setUsers([]);
    // Reset the selected user ID
    setSelectedUserId("");
    // Clear the group name
    setGroupName("");
    // Clear the group participants list
    setGroupParticipants([]);
    // Set the chat type to not be a group chat
    setIsGroupChat(false);
    // Execute the onClose callback/function
    setOpenAddChat(false);
  };

  // useEffect hook to perform side effects based on changes in the component lifecycle or state/props
  useEffect(() => {
    // Check if the modal/dialog is not open
    if (!openAddChat) return;
    // Fetch users if the modal/dialog is open
    getUsers();
    // The effect depends on the 'open' value. Whenever 'open' changes, the effect will re-run.
  }, [openAddChat]);

  return (
    <Transition.Root show={openAddChat} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-visible">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-x-hidden rounded-lg bg-secondary px-4 pb-4 pt-5 text-left shadow-xl transition-all w-[95%] sm:my-8 sm:max-w-3xl sm:p-6"
                style={{
                  overflow: "inherit",
                }}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-white"
                    >
                      Create chat
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-transparent text-zinc-400 hover:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2"
                      onClick={() => handleClose()}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div>
                  <Switch.Group as="div" className="flex items-center my-5">
                    <Switch
                      checked={isGroupChat}
                      onChange={setIsGroupChat}
                      className={classes.addChatModalSwitchContainer(isGroupChat)}
                    >
                      <span
                        aria-hidden="true"
                        className={classes.addChatModalSwitch(isGroupChat)}
                      />
                    </Switch>
                    <Switch.Label as="span" className="ml-3 text-sm">
                      <span
                        className={classes.addChatModalSwitchLabel(isGroupChat)}
                      >
                        Is it a group chat?
                      </span>{" "}
                    </Switch.Label>
                  </Switch.Group>
                  {isGroupChat ? (
                    <div className="my-5">
                      <Input
                        placeholder={"Enter a group name..."}
                        value={groupName}
                        onChange={(e) => {
                          setGroupName(e.target.value);
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="my-5">
                    <Select
                      placeholder={
                        isGroupChat
                          ? "Select group participants..."
                          : "Select a user to chat..."
                      }
                      value={isGroupChat ? "" : selectedUserId || ""}
                      options={users.map((user) => {
                        return {
                          label: user.username,
                          value: user._id,
                        };
                      })}
                      onChange={({ value }) => {
                        if (isGroupChat && !groupParticipants.includes(value)) {
                          // if user is creating a group chat track the participants in an array
                          setGroupParticipants([...groupParticipants, value]);
                        } else {
                          setSelectedUserId(value);
                          // if user is creating normal chat just get a single user
                        }
                      }}
                    />
                  </div>
                  {isGroupChat ? (
                    <div className="my-5">
                      <span
                        className="font-medium text-white inline-flex items-center"
                      >
                        <UserGroupIcon className="h-5 w-5 mr-2" /> Selected
                        participants
                      </span>{" "}
                      <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
                        {users
                          .filter((user) =>
                            groupParticipants.includes(user._id)
                          )
                          ?.map((participant) => {
                            return (
                              <div
                                className="inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                                key={participant._id}
                              >
                                <img
                                  className="h-6 w-6 rounded-full object-cover"
                                  src={participant.avatar}
                                />
                                <p className="text-white">
                                  {participant.username}
                                </p>
                                <XCircleIcon
                                  role="button"
                                  className="w-6 h-6 hover:text-primary cursor-pointer"
                                  onClick={() => {
                                    setGroupParticipants(
                                      groupParticipants.filter(
                                        (p) => p !== participant._id
                                      )
                                    );
                                  }}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="mt-5 flex justify-between items-center gap-4">
                  <Button
                    disabled={creatingChat}
                    severity={"secondary"}
                    onClick={handleClose}
                    className="w-1/2"
                  >
                    Close
                  </Button>
                  <Button
                    disabled={creatingChat}
                    onClick={isGroupChat ? createNewGroupChat : createNewChat}
                    className="w-1/2"
                  >
                    Create
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddChatModal;
