import { createContext, useContext, useState } from "react";

const SelectionWriteContext = createContext({
  setSelectedChannel: function () {}
})

const SelectionReadContext = createContext({
  selectedChannel: null
})

export function ChannelSelectionProvider({ children }) {
  const [selectedChannel, setSelectedChannel] = useState(null)

  return (
    <SelectionWriteContext value={{ setSelectedChannel }}>
      <SelectionReadContext value={{ selectedChannel }}>
        {children}
      </SelectionReadContext>
    </SelectionWriteContext>
  )
}

export function useSetChannelSelection() {
  return useContext(SelectionWriteContext)
}

export function useGetChannelSelection() {
  return useContext(SelectionReadContext)
}