import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Briefcase, DollarSign, Clock, Star } from "lucide-react";

const careerSections = [
  {
    id: 1,
    title: "Career Growth",
    description: "Explore opportunities to advance your professional journey",
    icon: Briefcase,
    color: "bg-blue-50",
  },
  {
    id: 2,
    title: "Competitive Salary",
    description: "We offer industry-leading compensation packages",
    icon: DollarSign,
    color: "bg-green-50",
  },
  {
    id: 3,
    title: "Work-Life Balance",
    description: "Flexible working arrangements and benefits",
    icon: Clock,
    color: "bg-amber-50",
  },
];

const jobListings = [
  {
    id: 1,
    title: "Senior Business Development Manager",
    company: "Tech Solutions India",
    location: "Bangalore, Karnataka",
    salary: "₹12L - ₹18L/year",
    type: "Full-time",
    experience: "5+ years",
    description:
      "Looking for an experienced professional to lead business expansion initiatives.",
    featured: true,
  },
  {
    id: 2,
    title: "Marketing Executive",
    company: "Global Marketing Services",
    location: "Mumbai, Maharashtra",
    salary: "₹5L - ₹8L/year",
    type: "Full-time",
    experience: "2-3 years",
    description:
      "Join our dynamic team to create impactful marketing campaigns.",
    featured: false,
  },
  {
    id: 3,
    title: "Software Developer (Full Stack)",
    company: "Innovation Labs",
    location: "Hyderabad, Telangana",
    salary: "₹8L - ₹15L/year",
    type: "Full-time",
    experience: "3-4 years",
    description:
      "Build scalable applications with cutting-edge technologies.",
    featured: true,
  },
  {
    id: 4,
    title: "HR Specialist",
    company: "Corporate Solutions",
    location: "Delhi, NCR",
    salary: "₹4.5L - ₹7L/year",
    type: "Full-time",
    experience: "2+ years",
    description:
      "Manage recruitment and employee development initiatives.",
    featured: false,
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-secondary to-secondary/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Build Your Future With Us
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Discover exciting career opportunities from top companies across India. Find roles
            that match your skills and aspirations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#jobs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Open Positions
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Contact Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why Choose a Career With Us?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Benefits and opportunities that support your growth
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {careerSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className="group overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-150 hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${section.color}`}
                  >
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="jobs" className="border-t border-border bg-secondary/30 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Open Positions
              </h2>
              <p className="mt-2 text-muted-foreground">
                {jobListings.length} opportunities available
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {jobListings.map((job) => (
              <div
                key={job.id}
                className="group overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-secondary p-2.5">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-saffron/10 px-2.5 py-1 text-xs font-medium text-saffron">
                              <Star className="h-3 w-3 fill-saffron" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {job.description}
                    </p>

                    {/* Details */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {job.experience}
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Link
                    href={`/careers/${job.id}`}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No More Jobs CTA */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
            <h3 className="text-lg font-semibold text-foreground">
              Can't find what you're looking for?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Upload your resume and get notified when new opportunities match your profile.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe to Job Alerts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              How to Apply
            </h2>
          </div>

          <div className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
            {[
              {
                step: "1",
                title: "Browse Opportunities",
                description: "Explore available positions that match your skills",
              },
              {
                step: "2",
                title: "Submit Application",
                description: "Fill out the application with your resume",
              },
              {
                step: "3",
                title: "Interview Process",
                description: "Connect with recruiters for interviews",
              },
              {
                step: "4",
                title: "Get Hired",
                description: "Receive your offer and start your journey",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-1 rounded-xl border border-border bg-secondary/30 p-5 text-center"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
