import { ChakraProvider } from "@chakra-ui/react";
import Notes from "./Components/Notes";


function App() {
  return (
    <div>
      <ChakraProvider>
        <Notes />
      </ChakraProvider>
    </div>
  );
}

export default App;
