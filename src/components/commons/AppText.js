import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AppText = ({text}) => {
  return (
    <Text style={{fontFamily: 'Poppins'}}>
        {text}
    </Text>
  )
}

export default AppText

const styles = StyleSheet.create({})