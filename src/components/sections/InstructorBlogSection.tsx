import { instructorBlogs } from "@/data/instructorBlogs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const InstructorBlogSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            강사 인사이트 & 후기
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            전문가들의 임상 경험과 치료 노하우를 <br className='md:hidden' />블로그에서 확인하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {instructorBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50"
              onClick={() => window.open(blog.blogUrl, '_blank')}
            >
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {blog.instructorName}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {blog.clinic}
                </p>
                <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                  {blog.description}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(blog.blogUrl, '_blank');
                  }}
                >
                  블로그 방문
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
