// https://cydstumpel.nl/

import * as THREE from 'three'
import React, { useRef, useState,useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import './util'

const cardData = [
    {
      title: "Overthought 2100",
      description: "Overthought 2100 is a speculative future of the west. Visualized through live footage with 3d model compositing and VFX. With the way we see 'free speech and expression' being affected in the past decade or two in reality, for better or worse, we can imagine what the world would look like if we went so far left that we reach authoritarian control of what's politically correct. A society where truly free thought has been phased out over 70 years through combining cancel culture/wokeness with harsh prosecution and capital punishment, followed by censorship of novels, philosophies, hate groups, and any expression that reinforces or spreads topics of controversy. This is a detailed description for Project 1. You can add specific details about the project, technologies used, and outcomes achieved.",
      videoUrl: "https://vimeo.com/1021344781?share=copy",
      imageUrl: "/img1_.png"
    },
    {
      title: "Barbican Expansion",
      description: "Filmed at the Barbican Centre in London, short form content for socials.",
      videoUrl: "/video2.mp4",
      imageUrl: "/img2_.png"
    },
    {
      title: "CCTV: Commonly Confused Tracking Visuals",
      description: "oo the classic red motion/facial tracking square! Do you hate being tracked? It’s your lucky day because now you can rest assured knowing that you’re not as important as you may think and unless you threaten public safety or the state you’ll be fine!!! :)",
      videoUrl: "/video3.mp4",
      imageUrl: "/img3_.png"
    },
    {
      title: "Video: The Consumer Medium",
      description: "Video content is being consumed more than ever as we see apps like Instagram and Facebook following TikTok's lead in promoting short video content as the standard. Immeasurable variety of content. Viral is no longer a word of any substance. We are now able to consume more content, more frequently, with more variety, than ever before. This is the current state of video, take a few minutes to observe the madness of it, bask in its absurdity. Acknowledge your ability to consume a style of video before and after forms that're wildly different ---- or feel free to continue scrolling.",
      videoUrl: "https://youtu.be/HoLc3T0ftzU",
      imageUrl: "/img4_.png"
    },
    {
      title: "Project 5",
      description: "Project 5 combines aesthetic appeal with practical utility. Describe the key features and benefits of this project.",
      videoUrl: "/video5.mp4",
      imageUrl: "/img5_.png"
    },
    {
      title: "Project 6",
      description: "Project 6 pushes boundaries in interactive design. Detail the innovative approaches and technologies used here.",
      videoUrl: "/video6.mp4",
      imageUrl: "/img6_.png"
    },
    {
      title: "Everything is layers",
      description: "Short form video edit for socials, filmed at a neighbourhood centre in Suzhou, China",
      videoUrl: "https://youtu.be/xj5QK23z2cY",
      imageUrl: "/img7_.png"
    },
    {
      title: "Anomaly.exe",
      description: "A part of the Overthought 2100 worldbuilding project, Anomoly.exe is a rebellious organisation that is one of ",
      videoUrl: "/video8.mp4",
      imageUrl: "/img8_.png"
    }
  ];

export const App = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedCard, setSelectedCard] = useState(null);
  
    useEffect(() => {
      const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);
  
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, aqua, black)`,
        }}
      >
        <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
          <fog attach="fog" args={['#a79', 8.5, 12]} />
          <ScrollControls pages={4} infinite>
            <Rig rotation={[0, 0, 0.15]}>
              <Carousel setSelectedCard={setSelectedCard} />
            </Rig>
            <Banner position={[0, -0.15, 0]} />
          </ScrollControls>
        </Canvas>
        {selectedCard && (
          <CardPopup card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </div>
    );
  };

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta) // Move camera
    state.camera.lookAt(0, 0, 0) // Look at center
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.4, setSelectedCard }) {
    return cardData.map((card, i) => (
      <Card
        key={i}
        index={i}
        cardData={card}
        position={[
          Math.sin((i / cardData.length) * Math.PI * 2) * radius,
          0,
          Math.cos((i / cardData.length) * Math.PI * 2) * radius
        ]}
        rotation={[0, Math.PI + (i / cardData.length) * Math.PI * 2, 0]}
        setSelectedCard={setSelectedCard}
      />
    ));
  }
  function Card({ cardData, index, setSelectedCard, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  const handleClick = (e) => {
    e.stopPropagation()
    setSelectedCard(cardData)
  }

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })

  return (
    <mesh 
      ref={ref} 
      {...props} 
      onPointerOver={pointerOver} 
      onPointerOut={pointerOut}
      onClick={handleClick}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent
        uniforms={{
          uTexture: { value: new THREE.TextureLoader().load(cardData.imageUrl) },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          varying vec2 vUv;
          void main() {
            vec2 flippedUv = vec2(1.0 - vUv.x, vUv.y);
            gl_FragColor = texture2D(uTexture, flippedUv);
          }
        `}
      />
    </mesh>
  )
}
  


function CardPopup({ card, onClose }) {
  const getVideoEmbed = (url) => {
    if (!url) return null;
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1];
      return videoId ? (
        <iframe
          style={{ width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} // Try without mute
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : null;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return videoId ? (
        <iframe
          style={{ width: '100%', height: '100%' }}
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1`} // Try without mute
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : null;
    }

    // For other platforms
    return (
      <iframe
        src={`${url}?autoplay=1`}
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{card.title}</h2>
        <div className="content-wrapper">
          <div className="video-container">
            {getVideoEmbed(card.videoUrl)}
          </div>
          <div className="text-container">
            <p>{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

  
  function Banner(props) {
  const ref = useRef()
  const texture = useTexture('/work_.png')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.material.time.value += Math.abs(scroll.delta) * 4
    ref.current.material.map.offset.x += delta / 2
  })
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[30, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}
