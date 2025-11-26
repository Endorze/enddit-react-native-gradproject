import { View, Text, } from "react-native";
import { Comment } from "../../../types/comment";

//
const Comment = ({ comment }: Comment) => {

    return (
        <View className="border-l pl-3 text-sm">
            <View className="px-12 flex flex-col gap-2">
                <Text>{comment}</Text>
            </View>
        </View>
    );
};

export default Comment;
