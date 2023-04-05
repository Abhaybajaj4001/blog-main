/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import PageLayout from "@/components/page-layout";
import { useSession } from "next-auth/react";
import { type MouseEvent, useRef, useState, type ChangeEvent } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import LoadingSpinner from "@/components/loading-spinner";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { Editor } from "@tinymce/tinymce-react";

const CreatePost = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const filePickerRef = useRef<HTMLInputElement>(null);
  const { mutate: publishPost, isLoading: isPosting } =
    api.posts.create.useMutation({
      onSuccess: () => {
        router.push("/").catch((err) => console.error(err));
      },
    });
  const { mutate: switchToAuthor } = api.profile.makeAuthor.useMutation();

  const editorRef = useRef<Editor | null>(null);

  if (status === "loading" || isPosting) {
    return <LoadingSpinner size={80} />;
  }

  if (status === "unauthenticated") {
    router.push("/").catch((err) => console.error(err));
  }

  function handlePublishPost(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (title.length === 0) {
      toast.error("Enter a title");
      return;
    }
    if (content.length === 0) {
      toast.error("Type some content");
      return;
    }

    switchToAuthor({
      id: session?.user.id as string,
    });
    publishPost({
      title,
      content,
      image: selectedFile,
    });
  }

  function addImageToPost(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if (e.target.files !== null) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    reader.onload = (readerEvent) => {
      if (
        readerEvent.target?.result !== undefined &&
        readerEvent.target &&
        typeof readerEvent.target.result === "string"
      ) {
        setSelectedFile(readerEvent.target.result);
      }
    };
  }

  return (
    <div className="h-screen">
      <PageLayout size="screen">
        <h1 className="border-b-[3px] border-amber-600 p-2 text-4xl font-bold">
          CREATE A NEW POST
        </h1>
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full items-center justify-between gap-x-2 border-b-[3px] border-amber-600 p-3">
            <label htmlFor="title" className="text-xl font-bold">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="mr-8 w-[80%] rounded p-2 text-black outline-none"
              placeholder="Title of your post"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex  w-full justify-between gap-x-3 border-b-[3px] border-amber-600 p-3">
            <span className="text-xl font-bold">Content</span>
            <div className="mr-8 flex h-[350px] w-[80%] flex-col overflow-scroll rounded bg-white p-2 text-black">
              <Editor
                onInit={(_evt, editor) => (editorRef.current = editor as any)}
                onEditorChange={(newVal) => setContent(newVal)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </div>
          <div className="flex h-[140px] w-full items-center border-b-[3px] border-amber-600 p-3">
            <div className="flex cursor-pointer items-center gap-x-3 text-2xl">
              <span className="text-xl font-bold">Images</span>
              <div
                onClick={() => {
                  if (filePickerRef !== null) {
                    filePickerRef.current?.click();
                  }
                }}
              >
                <AiOutlinePlusCircle />
                <input
                  type="file"
                  hidden
                  ref={filePickerRef}
                  onChange={(e) => addImageToPost(e)}
                />
              </div>
              {selectedFile && (
                <div className="relative">
                  <RxCross2
                    className="absolute h-8 w-8 cursor-pointer rounded-full border border-white text-white shadow-md"
                    onClick={() => setSelectedFile("")}
                  />
                  <Image
                    alt="selected-image"
                    width={200}
                    height={200}
                    src={selectedFile}
                    // className={` ? "animate-pulse" : ""}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex w-full justify-center">
          <button
            onClick={(e) => handlePublishPost(e)}
            className="rounded bg-amber-600 p-2 font-bold transition-all hover:bg-amber-200"
          >
            Publish this Post!
          </button>
        </div>
      </PageLayout>
    </div>
  );
};

export default CreatePost;
