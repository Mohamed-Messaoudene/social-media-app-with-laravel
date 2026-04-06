import { Box } from '@mui/material'
import React from 'react'
import Story from './Story'
import AddNewStory from './AddNewStory'

function Stories() {
  return (
    <Box  display="flex" justifyContent="space-between" alignItems="center" paddingBlock={"15px"}>
    <AddNewStory imgUrl="/story1.jpg"/>
    <Story imgUrl="/public/default_cover_image.jpg" username="berkane" />
    <Story imgUrl="/public/default_cover_image.jpg" username="ali boucetta" />
    <Story imgUrl="/public/default_cover_image.jpg" username="boumedian" />
    <Story imgUrl="/public/default_cover_image.jpg" username="abd -elnour"/>
  </Box>
  )
}

export default Stories