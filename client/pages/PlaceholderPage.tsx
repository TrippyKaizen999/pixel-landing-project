import { Layout } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon = Construction,
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <Card className="card-ow max-w-md w-full text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-ow-orange/20 to-ow-blue/20 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-ow-orange" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-ow-orange">
              This page is under development. Continue prompting to build out
              this functionality!
            </p>
            <Link to="/">
              <Button className="btn-secondary w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
