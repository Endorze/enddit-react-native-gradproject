import * as ImagePicker from "expo-image-picker";


export const pickImage = async (setState: (uri: string | null) => void) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
        })

        if (!result.canceled) {
            setState(result.assets[0].uri);
        }
    }