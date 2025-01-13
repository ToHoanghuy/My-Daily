import {View, Text, Button} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addPlan,
  deletePlan,
  updatePlan,
} from '../../ReduxToolKit/Slices/Plan_Data';

const PlanData = () => {
  const data = useSelector(state => state.PlanData);
  const dispatch = useDispatch();
  return (
    <View>
      <Button
        title="Add Data Plan"
        onPress={() =>
          dispatch(
            addPlan({
              budget: Math.random() * 500,
              current: Math.random() * 800,
              dateFinish: new Date(),
              dateStart: new Date(),
              isIncomePlan: true,
              percentage: Math.random() * 100,
              planId: data.length,
              status: true,
            }),
          )
        }
      />
      <Button title="Delete Plan" onPress={() => dispatch(deletePlan(1))} />
      <Button
        title="Update Plan"
        onPress={() =>
          dispatch(
            updatePlan({
              id: 1,
              plan: {
                budget: Math.random() * 500,
                current: Math.random() * 800,
                dateFinish: new Date(),
                dateStart: new Date(),
                isIncomePlan: true,
                percentage: Math.random() * 100,
                planId: 10,
                status: true,
              },
            }),
          )
        }
      />
      <Button title="Console log" onPress={() => console.log(data.length)} />
    </View>
  );
};

export default PlanData;
