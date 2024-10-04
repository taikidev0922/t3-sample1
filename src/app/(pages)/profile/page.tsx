import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card";
import { Badge } from "~/app/components/ui/badge";
import { Progress } from "~/app/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/components/ui/avatar";
import { GraduationCap, Award, Briefcase, Star } from "lucide-react";

const ProfilePage = () => {
  const skills = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "GraphQL", level: 75 },
    { name: "Docker", level: 70 },
  ];

  const certifications = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "Microsoft Certified: Azure Developer Associate",
    "Certified Kubernetes Administrator (CKA)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card className="w-full bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-purple-500 shadow-lg">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Profile Picture"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800">
                John Doe
              </CardTitle>
              <p className="font-medium text-gray-600">
                Senior Full Stack Developer
              </p>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mx-auto max-w-lg text-gray-700">
              Passionate developer with 8+ years of experience in building
              scalable web applications. Expertise in modern JavaScript
              frameworks and cloud technologies.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="text-yellow-500" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="text-indigo-500" />
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="text-green-500" />
              <span>Work Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                Senior Developer at Tech Innovators Inc.
              </h3>
              <p className="text-gray-600">2018 - Present</p>
              <p className="mt-2 text-gray-700">
                Led development of multiple high-traffic web applications,
                improving performance by 40%.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Full Stack Developer at WebSolutions Co.
              </h3>
              <p className="text-gray-600">2015 - 2018</p>
              <p className="mt-2 text-gray-700">
                Developed and maintained over 20 client websites, focusing on
                responsive design and SEO optimization.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="text-blue-500" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-gray-800">
              Bachelor of Science in Computer Science
            </h3>
            <p className="text-gray-600">University of Technology, 2015</p>
            <p className="mt-2 text-gray-700">
              Graduated with Honors, GPA: 3.8/4.0
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
