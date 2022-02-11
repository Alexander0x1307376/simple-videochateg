import JoinConversation from "../components/pages/joinConversation";
import StartConversation from "../components/pages/startConversation";



const routes = [
  {
    key: 'startConversation',
    path: '/',
    element: <StartConversation />
  },
  {
    key: 'joinConversation',
    path: '/join/:idToConnect',
    element: <JoinConversation />
  },
];

export default routes;