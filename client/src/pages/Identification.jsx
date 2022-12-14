import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiInformationCircle } from 'react-icons/hi';
import axios from 'axios';
import Popup from '../components/Popup';
import Header from '../components/Header';
import InputForm from '../components/InputForm';

let challengeData = {
  username: '',
  session: '',
  answer: '',
};

function Identification() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [authCodeInputVisible, showAuthCodeInputVisible] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const additionalGuideList = [
    '럭키 룰렛 이벤트는 안내가 발송된 email 주소를 통해서 진행가능합니다',
    '입력된 정보는 이벤트 참여자 확인 이외의 목적으로 사용되지 않습니다',
  ];

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleAuthCode = (e) => {
    setAuthCode(e.target.value);
  };

  const onClickAuthButton = () => {
    console.log(process.env.REACT_APP_AUTH);
    axios
      .get(`${process.env.REACT_APP_AUTH}/login`, {
        params: {
          email: email,
        },
      })
      .then((res) => {
        if (res.data.message === 'login success') {
          challengeData['username'] = res.data.ChallengeParameters.USERNAME;
          challengeData['session'] = res.data.Session;
          showAuthCodeInputVisible(true);
        } else {
          setModalVisible(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const onClickConfirmButton = () => {
    challengeData['answer'] = authCode;
    console.log(challengeData);
    axios
      .post(`${process.env.REACT_APP_AUTH}/challenge`, {
        challengeData: challengeData,
      })
      .then((res) => {
        console.log('success');
        console.log(res);
        if (res.data.hasOwnProperty('accessToken')) {
          showAuthCodeInputVisible(false);

          let username = res.data.username;
          let token = res.data.accessToken;

          navigate('/survey', {
            state: { username: username, accessToken: token },
          });
        } else {
          console.log('fail');
          setModalVisible(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const onClickPopupButton = () => {
    navigate('/');
  };

  return (
    <div className="enter-container">
      <Header />
      <div className="form-container">
        <div className="info-icon">
          <HiInformationCircle size="50" color="#1d98b6" />
        </div>
        <div className="input-guide">럭키 룰렛 이벤트 참여</div>
        {additionalGuideList.map((value, i) => (
          <div className="additional-guide" key={i}>
            {value}
          </div>
        ))}
        <div className="identification-container">
          <InputForm
            guide="이벤트 안내를 수신한 email 주소를 입력해주세요"
            value={email}
            onChange={(event) => handleEmail(event)}
          />
          <button
            className="enter-button login-button"
            type="button"
            onClick={onClickAuthButton}
          >
            인증메일 발송
          </button>
          {authCodeInputVisible ? (
            <div>
              <InputForm
                guide="입력하신 email 주소로 발송된 인증코드를 입력해주세요"
                value={authCode}
                onChange={(event) => handleAuthCode(event)}
              />
              <button
                className="enter-button login-button"
                type="button"
                onClick={onClickConfirmButton}
              >
                인증코드 확인
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <Popup
        message="본 email로는 이벤트에 참여할 수 없습니다. 이벤트 대상자가 아니거나 잘못 입력된 email입니다"
        visible={modalVisible}
        onClickPopupButton={onClickPopupButton}
      />
    </div>
  );
}

export default Identification;
