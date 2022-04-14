import React, {useEffect, useState} from 'react'
import Snackbar from 'react-native-snackbar-component'

export const AppToast = ({label, isShow, type}) => {
    const [visible, setVisible] = useState(false)
    const [color, setColor] = useState('')
    const [textColor, setTextColor] = useState("#1F1F1F")
    useEffect(() => {
        if (type === 'success') return setColor('#C7FFBE')
        if (type === 'loading') return setColor('#a9a9a8')
        return setColor('#f87d7d')
    }, [type])

    useEffect(() => {
        setVisible(isShow)
    }, [isShow])

    return (
        <>
            {visible ? <Snackbar
                    visible={visible}
                    textMessage={label}
                    position="top"
                    top={10}
                    left={10}
                    right={10}
                    width={"100%"}
                    backgroundColor={color}
                    messageColor={textColor}
                    messageStyle={{fontWeight: "bold", fontSize: 16}}
                >
                </Snackbar>
                :
                <></>}
        </>

    )
}