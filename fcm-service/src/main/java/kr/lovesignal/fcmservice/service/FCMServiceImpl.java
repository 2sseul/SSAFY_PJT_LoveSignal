package kr.lovesignal.fcmservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;


import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;

import kr.lovesignal.fcmservice.entity.FCMEntity;
import kr.lovesignal.fcmservice.model.request.TokenRequest;
import kr.lovesignal.fcmservice.repository.FCMRepository;


@Service
public class FCMServiceImpl implements FCMService{

	private final FCMRepository fcmRepository;

	public FCMServiceImpl(FCMRepository fcmRepository) {
		this.fcmRepository = fcmRepository;
	}

	@Override
	@Transactional
	public void registerToken(TokenRequest tokenRequest) {


		UUID memberUUID = UUID.fromString(tokenRequest.getMemberUUID());
		String token = tokenRequest.getToken();
		String nickname = tokenRequest.getNickname();


//		Optional<FCMEntity> existingEntityOpt = fcmRepository.findByMemberUUID(memberUUID);
		FCMEntity findFcm = fcmRepository.findByUUID(memberUUID);

		System.out.println("*******************************");
		System.out.println(tokenRequest.getMemberUUID());
		System.out.println(tokenRequest.getToken());
		System.out.println(tokenRequest.getNickname());
		System.out.println("==============================");
		System.out.println(findFcm);
		System.out.println("==============================");
		System.out.println("*******************************");

		if(findFcm == null){
			createToken(memberUUID, token, nickname);
			System.out.println("저장됨");
		}
		else{
			updateToken(findFcm, token);
			System.out.println("업데이트됨");
		}

//		if(existingEntityOpt.isPresent()) {
//			existingEntityOpt.get().setToken(token);
//			fcmRepository.save(existingEntityOpt.get());
////			FCMEntity fcmEntity = existingEntityOpt.get();
////			fcmEntity.setToken(token);
////			fcmRepository.save(fcmEntity);
//		}else {
//			FCMEntity fcmEntity = tokenRequest.toEntity(memberUUID);
//	        fcmRepository.save(fcmEntity);
//		}
//		System.out.println("*******************************");
	}

	@Transactional
	public void createToken(UUID memberUUID, String token, String nickname){
		FCMEntity saveFcm = FCMEntity.builder()
				.UUID(memberUUID)
				.token(token)
				.nickname(nickname)
				.build();

		fcmRepository.save(saveFcm);

	}

	@Transactional
	public void updateToken(FCMEntity fcmEntity, String token){
		FCMEntity saveFcm = FCMEntity.builder()
				.fcmId(fcmEntity.getFcmId())
				.UUID(fcmEntity.getUUID())
				.token(token)
				.nickname(fcmEntity.getNickname())
				.build();

		fcmRepository.save(saveFcm);
	}

	@Override
	public void sendNotification(List<UUID> memberUUIDs) {

		List<FCMEntity> fcmEntities = fcmRepository.findAllByUUIDIn(memberUUIDs);

		for(FCMEntity fcmEntity : fcmEntities){
			if(fcmEntity.getToken() != null){
				Message message = Message.builder()
					.putData("title", "선택의 시간")
					.putData("content", "지금부터 10시 30분까지 마음에 드는 이성을 선택할 수 있습니다.")
					.setToken(fcmEntity.getToken())
					.build();

				try {
					String response = FirebaseMessaging.getInstance().send(message);
				}catch (Exception e){
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public void sendBuildingNotification(List<UUID> memberUUIDs) {
		List<FCMEntity> fcmEntities = fcmRepository.findAllByUUIDIn(memberUUIDs);

		for(FCMEntity fcmEntity : fcmEntities){
			if(fcmEntity.getToken() != null){
				Message message = Message.builder()
					.putData("title", "팀 빌딩 완료")
					.putData("content", "팀 빌딩이 완료되었고 동성 채팅방이 생성되었습니다.")
					.setToken(fcmEntity.getToken())
					.build();

				try {
					String response = FirebaseMessaging.getInstance().send(message);
				}catch (Exception e){
					e.printStackTrace();
				}
			}
		}
	}


	@Override
	public void sendMeetingNotification(List<String> memberUUIDs) {

		List<UUID> memberUUIDList = new ArrayList<>();
		for(String uuidString : memberUUIDs){
			UUID uuid = UUID.fromString(uuidString);
			memberUUIDList.add(uuid);
		}

		List<FCMEntity> fcmEntities = fcmRepository.findAllByUUIDIn(memberUUIDList);

		for(FCMEntity fcmEntity : fcmEntities){
			if(fcmEntity.getToken() != null){
				Message message = Message.builder()
					.putData("title", "시그널!")
					.putData("content", "상대팀과 매칭되었습니다. 시그널을 보내세요!")
					.setToken(fcmEntity.getToken())
					.build();

				try {
					String response = FirebaseMessaging.getInstance().send(message);
				}catch (Exception e){
					e.printStackTrace();
				}
			}
		}
	}
}
