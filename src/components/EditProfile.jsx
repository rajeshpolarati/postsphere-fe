import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'

const EditProfile = ({initialRef, finalRef, isOpen ,onClose, editPayload, setEditPayload, handleEdit}) => {
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent className='edit_profile_modal_container'>
          <form onSubmit={handleEdit}>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} className='edit_profile_modal'>
            <div className='name_input'>
            <FormControl className='input_group' >
              <FormLabel>First name</FormLabel>
              <Input ref={initialRef} placeholder='First name' type='text' required value={editPayload?.firstName} onChange={(e)=>{setEditPayload({...editPayload, firstName: e.target.value})}}/>
            </FormControl>
            <FormControl className='input_group'>
              <FormLabel>Last name</FormLabel>
              <Input placeholder='Last name' type='text' required value={editPayload?.lastName} onChange={(e)=>{setEditPayload({...editPayload, lastName: e.target.value})}}/>
            </FormControl>
            </div>
            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input type='url' placeholder='Social URL' value={editPayload?.url} onChange={(e)=>{setEditPayload({...editPayload, url: e.target.value})}}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Bio</FormLabel>
              <Input placeholder='Bio' type='text' value={editPayload?.bio} onChange={(e)=>{setEditPayload({...editPayload, bio: e.target.value})}}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='teal' mr={3} type='submit'>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
          </form>
        </ModalContent>
        
      </Modal>
    </>
  )
}

export default EditProfile
