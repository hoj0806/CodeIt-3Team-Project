import { app } from 'firebaseApp/config'
import { 
  createUserWithEmailAndPassword,
  getAuth, 
  GoogleAuthProvider,
  GithubAuthProvider, 
  signInWithPopup
} from 'firebase/auth'

import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import "../../css/signupform.css"
import { useInput } from "./useInput";
import { toast } from 'react-toastify'


function SignupForm() {

  const navigate = useNavigate();
 
  const nameValidator = (value:string) => {
    if(value === "") {
      return {
        isValid : false,
        message : '이름을 입력해주세요'
      } 
    }

    if(value.length <= 1) {
      return {
        isValid : false,
        message : '이름의 길이는 2자 이상이여야 합니다'
      }
    }

    return { isValid: true, message : ''}
  }

  const emailValidator = (value:string) => {
       // 이메일 포멧
       const emailRegEx =
       /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
       if(emailRegEx.test(value) === false) {
        return {
          isValid : false,
          message : '이메일 형식을 확인해주세요!'
        }
       }

       return { isValid : true, message : ''}
}

const passwordValidator = (value:string) => {
    // 최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 
    const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

    if(value.length < 8) {
      return {
        isValid : false,
        message : '비밀번호는 8자 이상이여야 합니다'
      }
    }

    if(passwordRegex.test(value) === false) {
      return {
        isValid : false,
        message : '비밀번호에는 최소 하나의 문자, 하나의 숫자 ,하나의 특수문자가 포함되어야 합니다'
      }
    }

    return { isValid : true , message : ''}
}

const passwordConfirmValidator = (value:string) => {

  if(value === "") {
    return {
      isValid : false,
      message : "비밀번호 확인란을 채워주세요!"
    }
  }

  if(value !== userPassword.inputValue) {
    return {
      isValid : false,
      message : "비밀번호가 일치하지 않습니다!"
    }
  }

  return { isValid : true, message : ''}
}


const userName =  useInput('', nameValidator)
const userEmail = useInput('', emailValidator)
const userPassword = useInput('', passwordValidator) 
const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
 
  //파이어베이스 회원가입 로직
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try{
      const auth = getAuth(app);
      const {inputValue: email} = userEmail;
      const {inputValue: password} = userPassword;

      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("회원가입에 성공했습니다.")
      navigate("/users/login");
    }catch(error: any){
      console.log(error)
      toast.error(error?.code)
    }
  };

  //파이어베이스 소셜로그인 로직
  // 구글, 깃허브 중복 가입불가
  const onClickSocialLogin = async(e: React.MouseEvent<HTMLButtonElement>) => {
    

    const buttonElement = e.target as HTMLButtonElement;

    const name = buttonElement.name;

    let provider;
    const auth = getAuth(app);

    if(name  === "google"){
      provider = new GoogleAuthProvider();
    }

    if(name  === "github"){
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(auth, provider as GoogleAuthProvider | GithubAuthProvider)
    .then((result) => {
      console.log(result);
      toast.success("회원가입에 성공했습니다.")

    })
    .catch((error)=>{
      console.log(error);
      const errorMessage = error?.message;
      toast.error("회원가입이 정상적으로 이루워지지 않았습니다.")
    })
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>이름</label>
          <input placeholder="이름" type="text" value={userName.inputValue} onChange={userName.handleChange} ></input>
          {<div>{nameValidator(userName.inputValue).message}</div>}
        </div>

        <div>
        <label>이메일</label>
        <input placeholder="이메일" type="text" value={userEmail.inputValue} onChange={userEmail.handleChange}></input>
        { <div>{emailValidator(userEmail.inputValue).message}</div>}
        </div>

        <div>
        <label>비밀번호</label>
        <input placeholder="password" type="password" value={userPassword.inputValue} onChange={userPassword.handleChange}></input>
        { <div>{passwordValidator(userPassword.inputValue).message}</div>}
        </div>

        <div>
          <label>비밀번호 확인</label>
          <input placeholder="passwordconfirm" type="password" onChange={(e) => setUserPasswordConfirm(e.target.value)} value={userPasswordConfirm}></input>
          {<div>{passwordConfirmValidator(userPasswordConfirm).message}</div>}
        </div>

        <button type="submit" disabled={
          !nameValidator(userName.inputValue).isValid ||
          !emailValidator(userEmail.inputValue).isValid ||
          !passwordValidator(userPassword.inputValue).isValid ||
          !passwordConfirmValidator(userPasswordConfirm).isValid  
          }>회원가입</button>
  
          <button type='button' name='google' className='form_btn--google' onClick={onClickSocialLogin}>Google로 회원가입</button>
          <button type='button' name='github' className='form_btn--github' onClick={onClickSocialLogin}>Github로 회원가입</button>

      </form>
    </div>
  )

}
  
 
export default SignupForm