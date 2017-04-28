import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

const styles = StyleSheet.create({
  datePicker: {
    width: 335,
    backgroundColor: '#27ae60',
    marginBottom: 18,
    borderRadius: 8,
  },
  startTimePicker: {
    width: 154,
    backgroundColor: '#27ae60',
    marginBottom: 18,
    borderRadius: 8,
  },
  endTimePicker: {
    width: 154,
    marginLeft: 25,
    backgroundColor: '#27ae60',
    marginBottom: 18,
    borderRadius: 8,
  },
});

class MyDatePicker extends Component {
  render() {
    return (
      <View>
        <DatePicker
          style={styles.datePicker}
          date={this.props.event.date}
          mode="date"
          format="YYYY-MM-DD"
          confirmBtnText="Confirm"
          placeholder="PICK A DATE"
          cancelBtnText="Cancel"
          customStyles={{
            placeholderText: {
              color: 'white',
              fontWeight: '500',
            },
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
              borderWidth: 0,
            },
            dateText: {
              color: 'white',
              fontWeight: '500',
            },
          }}
          onDateChange={(date) => { this.props.saveDate(date); }}
        />
        <View style={{ flexDirection: 'row' }}>
        <DatePicker
          style={styles.startTimePicker}
          date={this.props.event.startTime}
          mode="time"
          format="HH:mm A"
          confirmBtnText="Confirm"
          placeholder="START TIME"
          cancelBtnText="Cancel"
          iconSource={{uri: 'https://cdn0.iconfinder.com/data/icons/iconico-3/1024/42.png'}}
          minuteInterval={10}
          customStyles={{
            placeholderText: {
              color: 'white',
              fontWeight: '500',
            },
            confirmBtnText: {
              color: 'white',
            },
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
              borderWidth: 0,
            },
            dateText: {
              color: 'white',
              fontWeight: '500',
            },
          }}
          onDateChange={(startTime) => { this.props.saveStartTime(startTime); }}
        />
        <DatePicker
          style={styles.endTimePicker}
          date={this.props.event.endTime}
          mode="time"
          format="HH:mm A"
          confirmBtnText="Confirm"
          placeholder="END TIME"
          cancelBtnText="Cancel"
          minuteInterval={10}
          iconSource={{uri: 'https://cdn0.iconfinder.com/data/icons/iconico-3/1024/42.png'}}
          customStyles={{
            placeholderText: {
              color: 'white',
              fontWeight: '500',
            },
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
              borderWidth: 0,
            },
            dateText: {
              color: 'white',
              fontWeight: '500',
            },
          }}
          onDateChange={(endTime) => { this.props.saveEndTime(endTime); }}  
        />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDatePicker);
