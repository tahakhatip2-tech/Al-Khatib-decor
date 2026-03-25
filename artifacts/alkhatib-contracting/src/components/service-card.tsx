import { Link } from "wouter";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: any;
  category: string;
  onInquiry: () => void;
}

export function ServiceCard({ id, title, description, image, icon: Icon, onInquiry }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-primary/10 border border-slate-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-lg bg-primary/90 backdrop-blur flex items-center justify-center shadow-lg">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow">
          {description}
        </p>
        
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
          <Link href={`/services/${id}`} className="flex-1">
            <Button variant="outline" className="w-full text-secondary border-secondary/20 hover:bg-secondary hover:text-white rounded-xl">
              التفاصيل
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <Button 
            onClick={onInquiry}
            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20"
          >
            استفسار
            <MessageSquare className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
