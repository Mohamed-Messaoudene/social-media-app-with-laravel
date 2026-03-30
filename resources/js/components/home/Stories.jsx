import { Box } from '@mui/material'
import React from 'react'
import Story from './Story'
import AddNewStory from './AddNewStory'

function Stories() {
  return (
    <Box  display="flex" justifyContent="space-between" alignItems="center" paddingTop={"15px"}>
    <AddNewStory imgUrl="/story1.jpg"/>
    <Story imgUrl="/story2.jpg" username="berkane" />
    <Story imgUrl="/story3.jpg" username="ali boucetta" />
    <Story imgUrl="/story4.jpg" username="boumedian" />
    <Story imgUrl="/story5.jpg" username="abd elnour"/>
  </Box>
  )
}

export default Stories