"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Eye, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/types/form";
import { getForms, deleteForm, generateShareableUrl } from "@/lib/storage";
import Link from "next/link";

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    setForms(getForms());
  }, []);

  const handleDeleteForm = (id: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      deleteForm(id);
      setForms(getForms());
    }
  };

  const handleShareForm = (id: string) => {
    const url = generateShareableUrl(id);
    navigator.clipboard.writeText(url);
    alert("Form URL copied to clipboard!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">FormFy</h1>
          <p className="text-gray-600 mt-2">Create and manage dynamic forms</p>
        </div>
        <Link href="/forms/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Form
          </Button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first dynamic form to get started
            </p>
            <Link href="/forms/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {form.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  <p>{form.questions.length} questions</p>
                  <p>Destination: {form.destinationEmail}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/forms/${form.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareForm(form.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
