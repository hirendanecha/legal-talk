import { Pipe, PipeTransform } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { UserService } from "../services/user.service";

@Pipe({
  name: "getImageUrl",
  pure: true
})
export class GetImageUrlPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  transform(value: string, defaultImageUrl?: string): any {
    if (!value) {
      return of(defaultImageUrl);
    }

    return this.userService.getImageUrl(value).pipe(
      map((blob) => {
        return URL.createObjectURL(blob);
      }), catchError(() => {
        return defaultImageUrl
      })
    );
  }
}
