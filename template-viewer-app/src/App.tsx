import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import NextImg from './assets/images/next.png';
import PrevImg from './assets/images/previous.png';

// const SERVER = process.env.REACT_APP_SERVER_URL;
const SERVER = 'http://localhost:8081';

interface Template {
  id: string;
  cost: number;
  description: string;
  thumbnail: string;
  title: string;
  image: string;
};

interface ImageDetailsProps {
  template?: Template | null;
  first: boolean;
  last: boolean;
  setNextThumbnail: () => void;
  setPreviousThumbnail: () => void;
}

const ImageDetails = ({ template, first, last, setNextThumbnail, setPreviousThumbnail }: ImageDetailsProps) => {
  return (
    <div>
      <img src={`${SERVER}/large/${template?.image}`} className='' alt='selected' />
      <ul className=''>
        <li><span>ID: </span> {template?.id}</li>
        <li><span>Cost: </span> {template?.cost}</li>
        <li><span>Description: </span> {template?.description}</li>
        <li><span>Filename: </span> {template?.image}</li>
      </ul>
      <div className=''>
        <div className=''>
          <img src={PrevImg} onClick={setPreviousThumbnail} className={first ? 'disabled' : ''} alt='previous' />
          <img src={NextImg} onClick={setNextThumbnail} className={last ? 'disabled' : ''} alt='next' />
        </div>
      </div>

    </div>
  );
};

interface FilmstripProps {
  templates: Template[];
  selectedThumbnailIndex: number;
  onThumbnailClick: (index: number) => void;
  offset: number;
}

const Filmstrip = ({ templates, selectedThumbnailIndex, onThumbnailClick, offset }: FilmstripProps) => {
  const handleThumbnailClick = (index: number) => {
    onThumbnailClick(index);
  };

  return (
    <div className={'filmstrip'}>
      <div style={{ transform: `translateX(${offset}px)` }}>
        {templates.map((template, i) => {
          <Thumbnail
            thumbnail={`${SERVER}/thumbnails/${template.thumbnail}`}
            thumbnailName={template.thumbnail}
            isSelected={i === selectedThumbnailIndex}
            click={() => handleThumbnailClick(i)}
          />
        })}
      </div>
    </div>
  );
}

interface ThumbnailProps {
  thumbnail: string;
  thumbnailName: string;
  isSelected: boolean;
  click: () => void;
};

const Thumbnail = ({ thumbnail, thumbnailName, isSelected, click }: ThumbnailProps) => {
  return (
    <div>
      <img
        src={thumbnail}
        alt='Thumbnail'
        className={`${isSelected ? 'selected' : ''}`}
        onClick={click}
      />
      <p>{thumbnailName}</p>
    </div>
  );
}

const App = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<Template[]>(`${SERVER}/images`);
        const { data } = response;

        setTemplates(data);
        setSelectedTemplate(data[0]);
      } catch (error) {
        console.log('error fetching data: ', error);
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedThumbIndex < 2) {
      setOffset(0);
    } else {
      const wrappedWidth = 520;
      const itemWidth = 128;

      const centerPosition = wrappedWidth / 2;
      const itemPosition = selectedThumbIndex * itemWidth;
      setOffset(centerPosition - itemPosition - itemWidth / 2);
    }
  }, [selectedThumbIndex]);

  const handleThumbnailClick = (index: number) => {
    setSelectedThumbIndex(index);
    setSelectedTemplate(templates[index]);
  };

  const isLastThumbnail = selectedThumbIndex === templates.length - 1;

  const handleSetNextThumbnail = () => {
    if (!isLastThumbnail) {
      const nextThumbnailIndex = selectedThumbIndex + 1;
      setSelectedThumbIndex(nextThumbnailIndex);
      setSelectedTemplate(templates[nextThumbnailIndex]);
    }
  }

  const handleSetPreviousThumbnail = () => {
    if (selectedThumbIndex > 0) {
      const previousThumbnailIndex = selectedThumbIndex - 1;
      setSelectedThumbIndex(previousThumbnailIndex);
      setSelectedTemplate(templates[previousThumbnailIndex]);
    }
  }

  return (
    <div>
      <h1>Image Gallery</h1>
      <ImageDetails
        template={selectedTemplate}
        first={selectedThumbIndex === 0}
        last={isLastThumbnail}
        setNextThumbnail={handleSetNextThumbnail}
        setPreviousThumbnail={handleSetPreviousThumbnail}
      />
      <Filmstrip
        templates={templates}
        selectedThumbnailIndex={selectedThumbIndex}
        onThumbnailClick={handleThumbnailClick}
        offset={offset}
      />
    </div>
  )
}

export default App
