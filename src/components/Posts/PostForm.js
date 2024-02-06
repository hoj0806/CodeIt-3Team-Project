import PostSelect from "components/SelectBox/PostSelect";
import * as selectData from "components/SelectBox/data";
import { useState, useEffect } from "react";
import { db } from "firebaseApp/config";
import firebase, { app } from "firebaseApp/config";
import { collection, getDocs, doc, setDoc, addDoc, getDoc, Firestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PostTitleInput from "./PostTitleInput";
import PostContentInput from "./PostContentInput";
import PostSubTitleInput from "./PostSubTitleInput";
import style from "./PostWriteForm.module.scss";
import styles from "./PostButtonBox.module.scss";

function PostForm() {
  // 셀렉터 (순서는 데이터에 있는 수서 그대로입니다)
  const [studyType, setStudyType] = useState("");
  const [studyMember, setStudyMember] = useState("");
  const [studySystem, setStudySystem] = useState("");
  const [studyCount, setStudyCount] = useState("");
  // 인풋
  const [postTitle, setPostTitle] = useState("");
  const [postSubTitle, setPostSubTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [uid, setUid] = useState("");
  const [postType, setPostType] = useState("");

  const auth = getAuth(app);

  const post = {
    studyType: studyType,
    studyMember: studyMember,
    studySystem: studySystem,
    studyCount: studyCount,
    postTitle: postTitle,
    postSubTitle: postSubTitle,
    postContent: postContent,
    stacks: ["typescript", "javascript", "nextjs", "react"],
    uid: uid,
    createdAt: "2024. 1. 17. 오후 11:03:02",
    postDeadline: "2025. 1. 21",
  };
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUid(user.uid);
      post.uid = uid;
    });
  });

  const handleStudyType = value => {
    setStudyType(value);
  };

  const handleMember = value => {
    setStudyMember(value);
  };

  const handleStudySystem = value => {
    setStudySystem(value);
  };

  const handleStudyCount = value => {
    setStudyCount(value);
  };
  const onSubmit = () => {};
  console.log(selectData);
  return (
    <>
      <div className={style.select_container}>
        <div>
          <PostSelect
            title={selectData.classification.title}
            placehoder={selectData.classification.placehoder}
            list={selectData.classification.list}
            onChange={handleStudyType}
          />
          <button onClick={onSubmit}></button>
        </div>
        <div>
          <PostSelect
            title={selectData.members.title}
            placehoder={selectData.members.placehoder}
            list={selectData.members.list}
            onChange={handleMember}
          />
          <button onClick={onSubmit}></button>
        </div>
        <div>
          <PostSelect
            title={selectData.system.title}
            placehoder={selectData.system.placehoder}
            list={selectData.system.list}
            onChange={handleStudySystem}
          />
          <button onClick={onSubmit}></button>
        </div>
        <div>
          <PostSelect
            title={selectData.studyCount.title}
            placehoder={selectData.studyCount.placehoder}
            list={selectData.studyCount.list}
            onChange={handleStudyCount}
          />
          <button onClick={onSubmit}></button>
        </div>
      </div>

      <div style={{ margin: "0 auto", width: "1300px" }}>
        <form className={style.post_form_container}>
          <PostTitleInput postTitle={postTitle} setPostTitle={setPostTitle} />
          <PostSubTitleInput postSubTitle={postSubTitle} setPostSubTitle={setPostSubTitle} />
          <PostContentInput postContent={postContent} setPostContent={setPostContent} />
          <div className={styles.post_button_box}>
            <button className={styles.post_cancel_button}>작성한거 취소할래요.</button>
            <button
              className={styles.post_submit_button}
              onClick={e => {
                e.preventDefault();
                addDoc(collection(db, "posts"), post);
              }}
              // disabled={true}
            >
              발행 할래요.
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PostForm;
