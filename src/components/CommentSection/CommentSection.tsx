import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCommentsForPost } from "../../utils/postUtils/getPostComments";
import { Pressable, TextInput, View, Text } from "react-native";
import { addComment } from "../../utils/postUtils/addComment";
import CommentsList from "../feed/CommentList";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";


const CommentSection = ({ postId }: { postId: number }) => {
    const [newComment, setNewComment] = useState("");
    const { accessToken } = useAuth();

    const {
        data: comments = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => getCommentsForPost(postId),
    });

    const mutation = useMutation({
        mutationFn: async () => {
            await addComment({ postId, newComment, accessToken });
        },
        onSuccess: () => {
            setNewComment("");
            refetch();
        },
    });

    if (isLoading) return <Text className="text-center mt-4 text-gray-500 text-sm">Loading comments…</Text>;

    return (
        <View>
            <View className="flex gap-2">
                <View className="flex flex-col gap-2 w-full bg-gray-200 rounded-2xl px-3 py-2 mb-2">
                    <TextInput
                        placeholder="Write a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        className="text-sm outline-0"
                    />
                    {newComment && newComment.length > 0 && (

                        <Pressable
                            onPress={() => {
                                if (!newComment.trim()) return;
                                mutation.mutate();
                            }}
                            disabled={mutation.isPending}
                            className="bg-blue-600 self-end px-3 py-2 rounded-md disabled:opacity-50"
                        >
                            <Ionicons
                                name="paper-plane"
                                size={16}
                                color="white"
                            />
                        </Pressable>

                    )}
                </View>
            </View>
            {comments.length === 0 ? (
                <View className="w-full">
                    {comments.length === 0 && newComment.length === 0 && (
                        <Text>No comments yet.</Text>
                    )}
                </View>
            ) : (
                
                <View className="space-y-2 mb-3">
                    <CommentsList comments={comments} />
                </View>
            )}

        </View>
    );
};

export default CommentSection;
