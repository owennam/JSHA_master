import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "@/data/videos";
import { Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface VideoCardProps {
  video: Video;
}

const difficultyLabels = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급'
};

const categoryLabels = {
  balance: '균형',
  posture: '자세',
  breathing: '호흡',
  flexibility: '유연성'
};

export const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <Link to={`/education/${video.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-border/50">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
              <Clock className="w-3 h-3 mr-1" />
              {video.duration}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
              {video.title}
            </CardTitle>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm">
              {categoryLabels[video.category]}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {difficultyLabels[video.difficulty]}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="w-3 h-3" />
            <span className="line-clamp-1">{video.tags.slice(0, 2).join(', ')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
