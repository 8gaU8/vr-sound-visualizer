import * as THREE from 'three';

export class HapticsManager{
    constructor(){
        this.gamepad = null;
        this.analyzerMap = new Map();
    }
    updateGamepad(session){
        if (session){
                    // Get VR gamepad specifically
            const inputSources = Array.from(session.inputSources);
            for (const inputSource of inputSources) {
                if (inputSource.gamepad && inputSource.handedness === 'right') {
                    this.gamepad = inputSource.gamepad;
                    break;
                }
            }
        }
    }

    audioHaptics(audio,options={
        intensityMultiplier: 1.0,
        frequncyRange:[0,32],
        minIntensity: 0.001,
        maxIntensity: 1.0,
        threshold: 0.3
    }){ const analyzer = new THREE.AudioAnalyser(audio, 32);
        this.analyzerMap.set(audio, {analyzer, options});
    }
    
    update(){
        if (!this.gamepad || !this.gamepad.hapticActuators || !this.gamepad.hapticActuators[0]) return;

        this.analyzerMap.forEach(({ analyzer, options }, audio) => {
            if (audio.isPlaying) {
                const frequencyData = analyzer.getFrequencyData();
                const average = this.getAverageFrequency(
                    frequencyData,
                    options.frequencyRange[0],
                    options.frequencyRange[1]
                );

                // Map frequency intensity to haptic strength
                const intensity = Math.min(Math.max(
                    average * options.intensityMultiplier,
                    options.minIntensity
                ), options.maxIntensity);

         // Trigger haptic pulse
         if (intensity >= options.threshold){
              try {
                    this.gamepad.hapticActuators[0].playEffect('dual-rumble', {
                        duration: 100,
                        strongMagnitude: intensity,
                        weakMagnitude: intensity
                    });
                } catch (error) {
                    console.warn('Haptics not supported:', error);
                }
            }}
    });
}

 getAverageFrequency(fData, minFreq, maxFreq) {
        let sum = 0;
        let count = 0;
        
        for (let i = minFreq; i <= maxFreq; i++) {
            if (fData[i]) {
                sum += fData[i];
                count++;
            }
        }
        
        return count > 0 ? (sum / count) / 255 : 0;
    }

}