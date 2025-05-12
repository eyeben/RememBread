import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SEPARATOR = "퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁퉁";

type FolderPathBreadcrumbProps = {
  path: string;
  toggleFolder: (folderId: number) => void;
};

const FolderPathBreadcrumb = ({ path, toggleFolder }: FolderPathBreadcrumbProps) => {
  const segments = path
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  if (segments.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem onClick={() => toggleFolder(Number(segments[0].split(SEPARATOR)[0]))}>
            <p className="text-lg">{"📁 " + segments[0].split(SEPARATOR)[1]}</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const first = segments[0];
  const middle = segments.slice(1, -1);
  const last = segments[segments.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem onClick={() => toggleFolder(Number(first.split(SEPARATOR)[0]))}>
          <p className="text-lg">{"📁 " + first.split(SEPARATOR)[1]}</p>
        </BreadcrumbItem>

        {middle.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only text-lg">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {middle.map((item, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => toggleFolder(Number(item.split(SEPARATOR)[0]))}
                    >
                      {"📁 " + item.split(SEPARATOR)[1]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <p className="text-lg">
            {last.split(SEPARATOR)[1].startsWith("🍞")
              ? last.split(SEPARATOR)[1]
              : "📁 " + last.split(SEPARATOR)[1]}
          </p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default FolderPathBreadcrumb;
