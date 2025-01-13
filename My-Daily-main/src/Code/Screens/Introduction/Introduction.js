import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {FONT_FAMILY} from '../../Assets/Constants/FontCustom';
import HeaderDrawer from '../../CustomComponents/HeaderDrawer';
import {useSelector} from 'react-redux';
import ColorCustom from '../../Assets/Constants/ColorCustom';

const Introduction = ({navigation}) => {
  const userSetting = useSelector(state => state.UserSetting).language;

  function Intro() {
    if (userSetting === 'English') {
      return (
        <View>
          <Text style={styles.text}>
            In the digital era, information technology has played an essential
            role in our daily lives. Mobile application development has become
            one of the sunrise industries and can be applied widely in many
            fields such as research, management, business, education, and so on.
            In addition, self-management has been one of the big problems for
            many people in such hustle and bustle of life. Being conscious of
            that, we would like to create software that can help people manage
            their schedules and finance easily.{'\n'}
            {'\n'}
            The system to support it must provide users with an easy-to-use,
            secure, and comprehensive personal finance management solution. As
            regard finance management function, the system will allow users to
            track their income and expenses, create budgets, set financial
            goals, and give reports and prompts.{'\n'}
          </Text>
          <Text style={styles.text3}>Features</Text>
          <Text style={styles.text}>
            {'\u2022'} Providing amount of daily expense: user enters the income
            and outcome. The system will calculate, add it to current money and
            store to database.{'\n'}
            {'\u2022'} Planning: user enters income target or outcome limit. The
            system will calculate and send notification if the expense exceeds
            the outcome limit. The system will also send notification once the
            user completed income target.{'\n'}
            {'\u2022'} Report: the system gives general outcome and income
            statistics, visual diagrams, charts based on specific periods.{'\n'}
          </Text>
          <Text style={styles.text3}>Used By</Text>
          <Text style={styles.text}>
            The app is targeted towards professionals, students, and anyone
            looking to improve their productivity and time and finance
            management skills. It is primarily aimed at individuals aged between
            18-45 years who are tech-savvy and looking for a mobile app that can
            help them stay organized and productive. {'\n'}
          </Text>
          <Text style={styles.text3}>Authors</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.text}>
            Trong kỷ nguyên số, công nghệ thông tin đã đóng một vai trò thiết
            yếu trong cuộc sống hàng ngày của chúng ta. Phát triển ứng dụng di
            động đã trở thành một trong những ngành công nghiệp mới nổi và có
            thể được ứng dụng rộng rãi trong nhiều lĩnh vực như nghiên cứu, quản
            lý, kinh doanh, giáo dục, v.v. Ngoài ra, quản lý cá nhân đã là một
            trong những vấn đề lớn đối với nhiều người trong cuộc sống hối hả
            như vậy. Ý thức được điều đó, chúng tôi mong muốn tạo ra phần mềm
            giúp mọi người quản lý lịch trình và tài chính một cách dễ dàng.
            {'\n'}
            {'\n'}
            Hệ thống hỗ trợ cung cấp cho người dùng giải pháp quản lý tài chính
            cá nhân dễ sử dụng, bảo mật và toàn diện. Với chức năng quản lý tài
            chính, hệ thống cho phép người dùng theo dõi thu nhập và chi tiêu
            của bản thân, tạo ngân sách, đặt mục tiêu tài chính cũng như đưa ra
            các báo cáo và nhắc nhở.{'\n'}
          </Text>
          <Text style={styles.text3}>Tính Năng</Text>
          <Text style={styles.text}>
            {'\u2022'} Cho biết số tiền chi thu hằng ngày: người dùng nhập vào
            số tiền của chi tiêu hoặc thu nhập. Hệ thống sẽ tính toán vào số
            tiền hiện có và lưu trữ vào cơ sở dữ liệu.{'\n'}
            {'\u2022'} Lập kế hoạch: người dùng nhập mục tiêu thu nhập và định
            mức chi tiêu. Hệ thống sẽ tính toán và gửi thông báo nếu người dùng
            chi tiêu vượt định mức hoặc gửi thông báo nếu mục tiêu thu nhập đã
            hoàn thành. {'\n'}
            {'\u2022'} Báo cáo: Hệ thống đưa ra thống kê của thu nhập và chi
            tiêu thông qua các biểu đồ trực quan theo từng thời gian cụ thể.
            {'\n'}
          </Text>
          <Text style={styles.text3}>Đối Tượng Sử Dụng</Text>
          <Text style={styles.text}>
            Ứng dụng hướng tới các đối tượng là sinh viên, chuyên gia và bất kì
            ai có nhu cầu cải thiện kỹ năng quản lý thời gian và tài chính của
            cá nhân. Ứng dụng chủ yếu nhằm vào các cá nhân trong độ tuổi 18-45,
            những người có hiểu biết về công nghệ và đang tìm kiếm một ứng dụng
            dành cho thiết bị di động có thể giúp họ có kỉ luật và quản lý cá
            nhân hiệu quả.{'\n'}
          </Text>
          <Text style={styles.text3}>Nhóm thực hiện</Text>
        </View>
      );
    }
  }
  return (
    <ScrollView style={styles.container}>
      <HeaderDrawer
        title={userSetting === 'English' ? 'Introduction' : 'Giới Thiệu'}
        onPressLeft={() => navigation.openDrawer()}
      />

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{height: 80, width: 200, resizeMode: 'contain'}}
            source={require('../../Assets/Images/Logo.png')}
          />
          <Text
            style={{
              fontFamily: FONT_FAMILY.Regular,
              fontSize: 12,
              color: '#7A7A7A',
            }}>
            Version 1.0.0
          </Text>
        </View>

        <View style={{paddingTop: 20}}>
          {Intro()}
          <Text style={[styles.text, {color: 'blue'}]}>Đoàn Tấn Khang</Text>
          <Text style={[styles.text, {color: 'blue'}]}>
            Nguyễn Thị Phương Tiên
          </Text>
          <Text style={[styles.text, {color: 'blue'}]}>Trần Lê Yến Linh</Text>
          <Text style={[styles.text, {color: 'blue'}]}>
            Nguyễn Thị Linh Chi
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorCustom.background,
  },
  text: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
    color: 'black',
    // textAlign: 'justify',
    lineHeight: 25,
  },
  text3: {
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 18,
    color: 'black',
    lineHeight: 40,
  },
});
export default Introduction;
