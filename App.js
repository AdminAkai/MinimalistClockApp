import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import dayjs from 'dayjs'

const { width } = Dimensions.get('screen')
const SIZE = width * 0.9
const TICK_INTERVAL = 1000

const App = () => {
  
  const [index, changeIndex] = useState(new Animated.Value(0))
  const [tick, changeTick] = useState(new Animated.Value(0))
  const [scales, changeScales] = useState([...Array(6).keys()].map(() => new Animated.Value(0)))

  _timer = 0
  _ticker = null

  _animate = () => {
    const scaleStaggerAnimations = scales.map(animated => {
      return Animated.spring(animated, {
        toValue: 1,
        tension: 18,
        friction: 3,
        useNativeDriver: true
      })
    })

    Animated.parallel([
      Animated.stagger(TICK_INTERVAL / scales.length, scaleStaggerAnimations),
      Animated.timing(index, {
        toValue: tick,
        duration: TICK_INTERVAL / 2,
        useNativeDriver: true
      })   
    ]).start()
  
  }

  const [
    smallQuadranScale, 
    mediumQuadranScale, 
    bigQuadranScale, 
    secondsScale, 
    minutesScale, 
    hoursScale
  ] = scales

  console.log(new Animated.Value(0))
  console.log(index)
  console.log(tick)


  const secondDegrees = Animated.multiply(index, 6)
  const interpolated = {
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  }

  const transformSeconds = {
    transform: [{ rotate: secondDegrees.interpolate(interpolated) }, { scale: secondsScale }]
  }
  const rotateMinutes = Animated.divide(secondDegrees, new Animated.Value(60))
  const transformMinutes = {
    transform: [{ rotate: rotateMinutes.interpolate(interpolated) }, { scale: minutesScale }]
  }
  const rotateHours = Animated.divide(rotateMinutes, new Animated.Value(12))
  const transformHours = {
    transform: [{ rotate: rotateHours.interpolate(interpolated) }, { scale: hoursScale }]
  }

  useEffect(() => {
    const current = dayjs()
    const diff = current.endOf('day').diff(current, 'seconds')
    const oneDay = 24 * 60 * 60
    
    _timer = oneDay - diff
    changeTick(_timer)
    changeIndex(_timer - 100)

    _animate()

    _ticker = setInterval(() => {
      _timer++
      changeTick(_timer)
    }, TICK_INTERVAL)

    return () => {
      clearInterval(_ticker)
      _ticker = null
    }
  }, [tick])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bigQuadran, { transform: [{ scale: bigQuadranScale }] }]}/>
      <Animated.View style={[styles.mediumQuadran, { transform: [{ scale: mediumQuadranScale }] }]}/>
      <Animated.View style={[styles.movers, transformHours]}>
        <View style={[styles.hours]}/>
      </Animated.View>
      <Animated.View style={[styles.movers, transformMinutes]}>
        <View style={[styles.minutes]}/>
      </Animated.View>
      <Animated.View style={[styles.movers, transformSeconds]}>
        <View style={[styles.seconds]}/>
      </Animated.View>
      <Animated.View style={[styles.smallQuadran, { transform: [{ scale: smallQuadranScale }] }]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  movers: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hours: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: '35%',
    marginTop: '15%',
    width: 4  ,
    borderRadius: 4
  },
  minutes: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: '45%',
    marginTop: '5%',
    width: 3,
    borderRadius: 3
  },
  seconds: {
    backgroundColor: 'rgba(227, 71, 134, 1)',
    height: '50%',
    width: 2,
    borderRadius: 2
  },
  bigQuadran: {
    width: SIZE * 0.8,
    height: SIZE * 0.8,
    borderRadius: SIZE * 0.4,
    position: 'absolute',
    backgroundColor: 'rgba(200, 200, 200, 0.2)'
  },
  mediumQuadran: {
    width: SIZE * 0.5,
    height: SIZE * 0.5,
    borderRadius: SIZE * 0.25,
    position: 'absolute',
    backgroundColor: 'rgba(200, 200, 200, 0.4)'
  },
  smallQuadran: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: 'rgba(227, 71, 134, 1)',
  }
});

export default App